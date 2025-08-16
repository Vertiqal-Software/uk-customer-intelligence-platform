# backend/api/companies.py
"""
REST API endpoints for company data and Companies House integration
"""

from flask import Blueprint, request, jsonify, g
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import logging

from backend.data_sources.companies_house import CompaniesHouseAPI
from backend.tasks.companies_house_ingestion import (
    fetch_company_profile,
    bulk_import_companies,
    monitor_all_companies
)

logger = logging.getLogger(__name__)

# Create Blueprint
bp = Blueprint('companies', __name__, url_prefix='/api/companies')

def get_tenant_id():
    """Get tenant ID from JWT claims"""
    # In production, extract from JWT
    # For now, return default tenant
    return 1

@bp.route('/search', methods=['GET'])
@jwt_required()
def search_companies():
    """
    Search for companies by name or registration number
    
    Query params:
        q: Search query (required)
        limit: Number of results (default 20)
    
    Returns:
        List of matching companies from Companies House
    """
    query = request.args.get('q')
    if not query or len(query) < 2:
        return jsonify({'error': 'Search query must be at least 2 characters'}), 400
    
    limit = min(int(request.args.get('limit', 20)), 50)
    
    try:
        api = CompaniesHouseAPI()
        results = api.search_companies(query, items_per_page=limit)
        
        # Format results for frontend
        companies = []
        for company in results:
            companies.append({
                'company_number': company.get('company_number'),
                'company_name': company.get('title'),
                'company_status': company.get('company_status'),
                'company_type': company.get('company_type'),
                'date_of_creation': company.get('date_of_creation'),
                'address': company.get('address_snippet'),
                'is_active': company.get('is_active', False),
                'years_in_business': company.get('years_in_business')
            })
        
        return jsonify({
            'results': companies,
            'count': len(companies),
            'query': query
        })
        
    except Exception as e:
        logger.error(f"Search error: {e}")
        return jsonify({'error': 'Search failed'}), 500

@bp.route('/lookup/<company_number>', methods=['GET'])
@jwt_required()
def lookup_company(company_number):
    """
    Get detailed company information from Companies House
    
    Path params:
        company_number: UK company registration number
    
    Returns:
        Detailed company profile
    """
    try:
        api = CompaniesHouseAPI()
        profile = api.get_company_profile(company_number)
        
        if not profile:
            return jsonify({'error': 'Company not found'}), 404
        
        # Get additional data
        officers = api.get_officers(company_number)
        filings = api.get_filing_history(company_number, items_per_page=10)
        charges = api.get_charges(company_number)
        pscs = api.get_persons_with_significant_control(company_number)
        
        # Format response
        response = {
            'profile': {
                'company_number': profile.company_number,
                'company_name': profile.company_name,
                'status': profile.company_status,
                'status_detail': profile.company_status_detail,
                'incorporation_date': profile.date_of_creation,
                'type': profile.type,
                'jurisdiction': profile.jurisdiction,
                'sic_codes': profile.sic_codes,
                'registered_address': profile.registered_office_address,
                'accounts': {
                    'next_due': profile.accounts.get('next_due'),
                    'last_made_up_to': profile.accounts.get('last_accounts', {}).get('made_up_to'),
                    'accounting_reference_date': profile.accounts.get('accounting_reference_date', {})
                },
                'confirmation_statement': {
                    'next_due': profile.confirmation_statement.get('next_due'),
                    'last_made_up_to': profile.confirmation_statement.get('last_made_up_to')
                },
                'has_charges': profile.has_charges,
                'has_insolvency_history': profile.has_insolvency_history,
                'previous_names': profile.previous_company_names
            },
            'officers': {
                'active': [o for o in officers if o.get('is_active')],
                'resigned': [o for o in officers if not o.get('is_active')],
                'total': len(officers)
            },
            'recent_filings': filings[:10],
            'charges': {
                'outstanding': [c for c in charges if c.get('is_outstanding')],
                'satisfied': [c for c in charges if c.get('is_satisfied')],
                'total': len(charges)
            },
            'persons_with_significant_control': pscs,
            'fetched_at': datetime.now().isoformat()
        }
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Lookup error for {company_number}: {e}")
        return jsonify({'error': 'Lookup failed'}), 500

@bp.route('/add', methods=['POST'])
@jwt_required()
def add_company():
    """
    Add a company to monitoring
    
    Request body:
        company_number: UK company registration number (required)
        priority: Monitoring priority (low/medium/high)
        notes: Optional notes
    
    Returns:
        Company addition status
    """
    data = request.get_json()
    company_number = data.get('company_number')
    
    if not company_number:
        return jsonify({'error': 'Company number required'}), 400
    
    tenant_id = get_tenant_id()
    
    try:
        # Trigger async import
        task = fetch_company_profile.delay(company_number, tenant_id)
        
        return jsonify({
            'status': 'importing',
            'task_id': task.id,
            'company_number': company_number,
            'message': 'Company import started. Data will be available shortly.'
        }), 202
        
    except Exception as e:
        logger.error(f"Add company error: {e}")
        return jsonify({'error': 'Failed to add company'}), 500

@bp.route('/bulk-import', methods=['POST'])
@jwt_required()
def bulk_import():
    """
    Bulk import multiple companies
    
    Request body:
        company_numbers: List of UK company registration numbers
    
    Returns:
        Import task status
    """
    data = request.get_json()
    company_numbers = data.get('company_numbers', [])
    
    if not company_numbers:
        return jsonify({'error': 'No company numbers provided'}), 400
    
    if len(company_numbers) > 100:
        return jsonify({'error': 'Maximum 100 companies per import'}), 400
    
    tenant_id = get_tenant_id()
    
    try:
        task = bulk_import_companies.delay(company_numbers, tenant_id)
        
        return jsonify({
            'status': 'importing',
            'task_id': task.id,
            'companies_count': len(company_numbers),
            'message': f'Importing {len(company_numbers)} companies'
        }), 202
        
    except Exception as e:
        logger.error(f"Bulk import error: {e}")
        return jsonify({'error': 'Bulk import failed'}), 500

@bp.route('/', methods=['GET'])
@jwt_required()
def list_companies():
    """
    List monitored companies for the tenant
    
    Query params:
        page: Page number (default 1)
        per_page: Items per page (default 20, max 100)
        status: Filter by status (active/dissolved/all)
        sort: Sort field (name/created/updated)
    
    Returns:
        Paginated list of companies
    """
    from backend.app import db
    
    tenant_id = get_tenant_id()
    page = int(request.args.get('page', 1))
    per_page = min(int(request.args.get('per_page', 20)), 100)
    status_filter = request.args.get('status', 'all')
    sort_by = request.args.get('sort', 'name')
    
    try:
        # Build query
        query = """
            SELECT 
                id, company_number, company_name, status,
                incorporation_date, company_type, 
                last_companies_house_check, created_at, last_updated,
                (SELECT COUNT(*) FROM alerts WHERE company_id = companies.id AND is_read = FALSE) as unread_alerts
            FROM companies
            WHERE tenant_id = %s
        """
        
        params = [tenant_id]
        
        if status_filter != 'all':
            query += " AND status = %s"
            params.append(status_filter)
        
        # Add sorting
        sort_map = {
            'name': 'company_name',
            'created': 'created_at DESC',
            'updated': 'last_updated DESC'
        }
        query += f" ORDER BY {sort_map.get(sort_by, 'company_name')}"
        
        # Add pagination
        query += " LIMIT %s OFFSET %s"
        params.extend([per_page, (page - 1) * per_page])
        
        # Execute query
        with db.engine.connect() as conn:
            result = conn.execute(query, params)
            companies = []
            
            for row in result:
                companies.append({
                    'id': row[0],
                    'company_number': row[1],
                    'company_name': row[2],
                    'status': row[3],
                    'incorporation_date': row[4].isoformat() if row[4] else None,
                    'company_type': row[5],
                    'last_checked': row[6].isoformat() if row[6] else None,
                    'created_at': row[7].isoformat(),
                    'last_updated': row[8].isoformat(),
                    'unread_alerts': row[9]
                })
            
            # Get total count
            count_result = conn.execute(
                "SELECT COUNT(*) FROM companies WHERE tenant_id = %s",
                [tenant_id]
            )
            total = count_result.fetchone()[0]
        
        return jsonify({
            'companies': companies,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': total,
                'pages': (total + per_page - 1) // per_page
            }
        })
        
    except Exception as e:
        logger.error(f"List companies error: {e}")
        return jsonify({'error': 'Failed to list companies'}), 500

@bp.route('/<int:company_id>', methods=['GET'])
@jwt_required()
def get_company(company_id):
    """
    Get detailed company information from database
    
    Path params:
        company_id: Internal company ID
    
    Returns:
        Complete company record with related data
    """
    from backend.app import db
    
    tenant_id = get_tenant_id()
    
    try:
        with db.engine.connect() as conn:
            # Get company
            company_result = conn.execute("""
                SELECT * FROM companies 
                WHERE id = %s AND tenant_id = %s
            """, [company_id, tenant_id])
            
            company = company_result.fetchone()
            if not company:
                return jsonify({'error': 'Company not found'}), 404
            
            # Get recent filings
            filings_result = conn.execute("""
                SELECT * FROM company_filings 
                WHERE company_id = %s 
                ORDER BY date DESC LIMIT 10
            """, [company_id])
            
            # Get officers
            officers_result = conn.execute("""
                SELECT * FROM company_officers 
                WHERE company_id = %s 
                ORDER BY is_active DESC, appointed_on DESC
            """, [company_id])
            
            # Get recent alerts
            alerts_result = conn.execute("""
                SELECT * FROM alerts 
                WHERE company_id = %s 
                ORDER BY created_at DESC LIMIT 10
            """, [company_id])
            
            # Format response
            response = {
                'company': dict(company),
                'recent_filings': [dict(f) for f in filings_result],
                'officers': [dict(o) for o in officers_result],
                'recent_alerts': [dict(a) for a in alerts_result]
            }
            
            return jsonify(response)
            
    except Exception as e:
        logger.error(f"Get company error: {e}")
        return jsonify({'error': 'Failed to get company'}), 500

@bp.route('/<int:company_id>/refresh', methods=['POST'])
@jwt_required()
def refresh_company(company_id):
    """
    Trigger a refresh of company data from Companies House
    
    Path params:
        company_id: Internal company ID
    
    Returns:
        Refresh task status
    """
    from backend.app import db
    
    tenant_id = get_tenant_id()
    
    try:
        # Get company number
        with db.engine.connect() as conn:
            result = conn.execute("""
                SELECT company_number FROM companies 
                WHERE id = %s AND tenant_id = %s
            """, [company_id, tenant_id])
            
            row = result.fetchone()
            if not row:
                return jsonify({'error': 'Company not found'}), 404
            
            company_number = row[0]
        
        # Trigger refresh
        task = fetch_company_profile.delay(company_number, tenant_id)
        
        return jsonify({
            'status': 'refreshing',
            'task_id': task.id,
            'company_id': company_id,
            'message': 'Company refresh started'
        }), 202
        
    except Exception as e:
        logger.error(f"Refresh error: {e}")
        return jsonify({'error': 'Refresh failed'}), 500

@bp.route('/monitor/trigger', methods=['POST'])
@jwt_required()
def trigger_monitoring():
    """
    Manually trigger monitoring for all companies
    
    Returns:
        Monitoring task status
    """
    tenant_id = get_tenant_id()
    
    try:
        task = monitor_all_companies.delay(tenant_id)
        
        return jsonify({
            'status': 'monitoring',
            'task_id': task.id,
            'message': 'Monitoring started for all companies'
        }), 202
        
    except Exception as e:
        logger.error(f"Monitor trigger error: {e}")
        return jsonify({'error': 'Failed to trigger monitoring'}), 500

@bp.route('/task/<task_id>', methods=['GET'])
@jwt_required()
def check_task_status(task_id):
    """
    Check status of an async task
    
    Path params:
        task_id: Celery task ID
    
    Returns:
        Task status and result
    """
    from celery.result import AsyncResult
    
    try:
        task = AsyncResult(task_id)
        
        response = {
            'task_id': task_id,
            'status': task.state,
            'current': task.info.get('current', 0) if task.info else 0,
            'total': task.info.get('total', 1) if task.info else 1,
        }
        
        if task.state == 'SUCCESS':
            response['result'] = task.result
        elif task.state == 'FAILURE':
            response['error'] = str(task.info)
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Task status error: {e}")
        return jsonify({'error': 'Failed to check task status'}), 500