# backend/tasks/companies_house_ingestion.py
"""
Celery tasks for Companies House data ingestion and monitoring
"""

import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from celery import group, chain
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
import json

from backend import celery
from backend.data_sources.companies_house import CompaniesHouseAPI, CompanyProfile
from backend.tasks.alert_generation import generate_company_alert

logger = logging.getLogger(__name__)

# Database connection for tasks
engine = create_engine(os.getenv("DATABASE_URL"))
Session = sessionmaker(bind=engine)

@celery.task(bind=True, max_retries=3)
def fetch_company_profile(self, company_number: str, tenant_id: int) -> Dict:
    """
    Fetch and store company profile from Companies House
    
    Args:
        company_number: UK company registration number
        tenant_id: Tenant ID for multi-tenant data isolation
        
    Returns:
        Company profile data
    """
    try:
        api = CompaniesHouseAPI()
        profile = api.get_company_profile(company_number)
        
        if not profile:
            logger.warning(f"Company not found: {company_number}")
            return {'error': 'Company not found'}
        
        # Store in database
        session = Session()
        try:
            # Check if company exists
            existing = session.execute(
                "SELECT id FROM companies WHERE company_number = %s AND tenant_id = %s",
                (company_number, tenant_id)
            ).fetchone()
            
            if existing:
                # Update existing company
                session.execute("""
                    UPDATE companies 
                    SET 
                        company_name = %s,
                        status = %s,
                        incorporation_date = %s,
                        company_type = %s,
                        sic_codes = %s,
                        registered_address = %s,
                        raw_data = %s,
                        last_updated = NOW(),
                        last_companies_house_check = NOW()
                    WHERE company_number = %s AND tenant_id = %s
                """, (
                    profile.company_name,
                    profile.company_status,
                    profile.date_of_creation,
                    profile.type,
                    json.dumps(profile.sic_codes),
                    json.dumps(profile.registered_office_address),
                    json.dumps(profile.__dict__),
                    company_number,
                    tenant_id
                ))
                company_id = existing[0]
                action = 'updated'
            else:
                # Insert new company
                result = session.execute("""
                    INSERT INTO companies (
                        tenant_id, company_number, company_name, status,
                        incorporation_date, company_type, sic_codes,
                        registered_address, raw_data, source,
                        last_companies_house_check, created_at, last_updated
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s, %s, %s, %s, 'companies_house',
                        NOW(), NOW(), NOW()
                    ) RETURNING id
                """, (
                    tenant_id,
                    company_number,
                    profile.company_name,
                    profile.company_status,
                    profile.date_of_creation,
                    profile.type,
                    json.dumps(profile.sic_codes),
                    json.dumps(profile.registered_office_address),
                    json.dumps(profile.__dict__)
                ))
                company_id = result.fetchone()[0]
                action = 'created'
            
            session.commit()
            
            logger.info(f"Company {action}: {profile.company_name} ({company_number})")
            
            # Trigger related data fetches
            fetch_company_filings.delay(company_number, company_id, tenant_id)
            fetch_company_officers.delay(company_number, company_id, tenant_id)
            
            return {
                'company_id': company_id,
                'company_number': company_number,
                'company_name': profile.company_name,
                'status': profile.company_status,
                'action': action
            }
            
        finally:
            session.close()
            
    except Exception as e:
        logger.error(f"Error fetching company {company_number}: {e}")
        raise self.retry(exc=e, countdown=60)

@celery.task(bind=True, max_retries=3)
def fetch_company_filings(self, company_number: str, company_id: int, tenant_id: int) -> List[Dict]:
    """
    Fetch and store company filing history
    
    Args:
        company_number: UK company registration number
        company_id: Internal company ID
        tenant_id: Tenant ID
        
    Returns:
        List of new/updated filings
    """
    try:
        api = CompaniesHouseAPI()
        filings = api.get_filing_history(company_number, items_per_page=50)
        
        session = Session()
        new_filings = []
        
        try:
            for filing in filings:
                # Check if filing exists
                existing = session.execute(
                    """SELECT id FROM company_filings 
                       WHERE company_id = %s AND transaction_id = %s""",
                    (company_id, filing.get('transaction_id'))
                ).fetchone()
                
                if not existing:
                    # Insert new filing
                    session.execute("""
                        INSERT INTO company_filings (
                            company_id, tenant_id, transaction_id, 
                            category, type, date, description,
                            paper_filed, raw_data, created_at
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
                    """, (
                        company_id,
                        tenant_id,
                        filing.get('transaction_id'),
                        filing.get('category'),
                        filing.get('type'),
                        filing.get('date'),
                        filing.get('description'),
                        filing.get('paper_filed', False),
                        json.dumps(filing)
                    ))
                    
                    new_filings.append(filing)
                    
                    # Generate alert for important filings
                    if filing.get('category') in ['accounts', 'confirmation-statement', 'incorporation']:
                        generate_company_alert.delay(
                            company_id=company_id,
                            tenant_id=tenant_id,
                            alert_type='new_filing',
                            data=filing
                        )
            
            session.commit()
            logger.info(f"Processed {len(filings)} filings, {len(new_filings)} new")
            
        finally:
            session.close()
        
        return new_filings
        
    except Exception as e:
        logger.error(f"Error fetching filings for {company_number}: {e}")
        raise self.retry(exc=e, countdown=60)

@celery.task(bind=True, max_retries=3)
def fetch_company_officers(self, company_number: str, company_id: int, tenant_id: int) -> Dict:
    """
    Fetch and store company officers
    
    Args:
        company_number: UK company registration number
        company_id: Internal company ID
        tenant_id: Tenant ID
        
    Returns:
        Officer change summary
    """
    try:
        api = CompaniesHouseAPI()
        officers = api.get_officers(company_number, active_only=False)
        
        session = Session()
        changes = {
            'new_appointments': [],
            'resignations': [],
            'total_officers': len(officers)
        }
        
        try:
            # Get existing officers
            existing_officers = session.execute(
                """SELECT officer_id, name, resigned_on 
                   FROM company_officers 
                   WHERE company_id = %s""",
                (company_id,)
            ).fetchall()
            
            existing_map = {o[0]: o for o in existing_officers}
            
            for officer in officers:
                officer_id = officer.get('links', {}).get('officer', {}).get('appointments', '').split('/')[-1]
                
                if officer_id in existing_map:
                    # Check for status change
                    if officer.get('resigned_on') and not existing_map[officer_id][2]:
                        # New resignation
                        changes['resignations'].append(officer)
                        
                        session.execute("""
                            UPDATE company_officers 
                            SET resigned_on = %s, is_active = FALSE, last_updated = NOW()
                            WHERE company_id = %s AND officer_id = %s
                        """, (
                            officer.get('resigned_on'),
                            company_id,
                            officer_id
                        ))
                else:
                    # New officer
                    is_new_appointment = self._is_recent_date(officer.get('appointed_on'), days=30)
                    if is_new_appointment:
                        changes['new_appointments'].append(officer)
                    
                    session.execute("""
                        INSERT INTO company_officers (
                            company_id, tenant_id, officer_id, name,
                            role, appointed_on, resigned_on, is_active,
                            nationality, date_of_birth, country_of_residence,
                            address, raw_data, created_at, last_updated
                        ) VALUES (
                            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW()
                        )
                    """, (
                        company_id,
                        tenant_id,
                        officer_id,
                        officer.get('name'),
                        officer.get('officer_role'),
                        officer.get('appointed_on'),
                        officer.get('resigned_on'),
                        officer.get('is_active', True),
                        officer.get('nationality'),
                        officer.get('date_of_birth'),
                        officer.get('country_of_residence'),
                        json.dumps(officer.get('address', {})),
                        json.dumps(officer)
                    ))
            
            session.commit()
            
            # Generate alerts for significant changes
            if changes['new_appointments']:
                generate_company_alert.delay(
                    company_id=company_id,
                    tenant_id=tenant_id,
                    alert_type='new_director',
                    data={'appointments': changes['new_appointments']}
                )
            
            if changes['resignations']:
                generate_company_alert.delay(
                    company_id=company_id,
                    tenant_id=tenant_id,
                    alert_type='director_resignation',
                    data={'resignations': changes['resignations']}
                )
            
            logger.info(f"Processed {len(officers)} officers for {company_number}")
            
        finally:
            session.close()
        
        return changes
        
    except Exception as e:
        logger.error(f"Error fetching officers for {company_number}: {e}")
        raise self.retry(exc=e, countdown=60)

@celery.task
def monitor_all_companies(tenant_id: int) -> Dict:
    """
    Monitor all companies for a tenant for changes
    
    Args:
        tenant_id: Tenant ID to monitor
        
    Returns:
        Summary of monitoring results
    """
    session = Session()
    try:
        # Get all active companies for tenant
        companies = session.execute(
            """SELECT id, company_number, company_name, last_companies_house_check
               FROM companies 
               WHERE tenant_id = %s AND is_monitored = TRUE""",
            (tenant_id,)
        ).fetchall()
        
        # Create task group for parallel processing
        job = group(
            check_company_changes.s(
                company_id=c[0],
                company_number=c[1],
                tenant_id=tenant_id,
                last_check=c[3]
            ) for c in companies
        )
        
        # Execute all checks in parallel
        result = job.apply_async()
        
        logger.info(f"Monitoring {len(companies)} companies for tenant {tenant_id}")
        
        return {
            'tenant_id': tenant_id,
            'companies_monitored': len(companies),
            'timestamp': datetime.now().isoformat()
        }
        
    finally:
        session.close()

@celery.task
def check_company_changes(company_id: int, company_number: str, 
                          tenant_id: int, last_check: Optional[datetime]) -> Dict:
    """
    Check a single company for changes since last check
    
    Args:
        company_id: Internal company ID
        company_number: UK company registration number
        tenant_id: Tenant ID
        last_check: Last check timestamp
        
    Returns:
        Dictionary of detected changes
    """
    try:
        api = CompaniesHouseAPI()
        changes = api.monitor_company_changes(company_number, last_check)
        
        if changes['changes_detected']:
            session = Session()
            try:
                # Update last check timestamp
                session.execute(
                    """UPDATE companies 
                       SET last_companies_house_check = NOW() 
                       WHERE id = %s""",
                    (company_id,)
                )
                
                # Store change log
                session.execute("""
                    INSERT INTO company_change_logs (
                        company_id, tenant_id, change_type, 
                        change_data, detected_at
                    ) VALUES (%s, %s, %s, %s, NOW())
                """, (
                    company_id,
                    tenant_id,
                    'companies_house_update',
                    json.dumps(changes)
                ))
                
                session.commit()
                
                # Trigger updates for specific changes
                if changes['new_filings']:
                    fetch_company_filings.delay(company_number, company_id, tenant_id)
                
                if changes['officer_changes']:
                    fetch_company_officers.delay(company_number, company_id, tenant_id)
                
                logger.info(f"Changes detected for {company_number}")
                
            finally:
                session.close()
        
        return changes
        
    except Exception as e:
        logger.error(f"Error checking changes for {company_number}: {e}")
        return {'error': str(e)}

@celery.task
def bulk_import_companies(company_numbers: List[str], tenant_id: int) -> Dict:
    """
    Bulk import multiple companies
    
    Args:
        company_numbers: List of UK company registration numbers
        tenant_id: Tenant ID
        
    Returns:
        Import summary
    """
    # Create chain of tasks for sequential processing
    # (to respect API rate limits)
    job = chain(
        fetch_company_profile.s(company_number, tenant_id)
        for company_number in company_numbers
    )
    
    result = job.apply_async()
    
    return {
        'tenant_id': tenant_id,
        'companies_queued': len(company_numbers),
        'timestamp': datetime.now().isoformat()
    }

# Scheduled tasks (to be configured in Celery beat)
@celery.task
def daily_company_monitoring():
    """
    Daily task to monitor all companies across all tenants
    """
    session = Session()
    try:
        # Get all active tenants
        tenants = session.execute(
            "SELECT id FROM tenants WHERE is_active = TRUE"
        ).fetchall()
        
        for tenant in tenants:
            monitor_all_companies.delay(tenant[0])
        
        logger.info(f"Triggered monitoring for {len(tenants)} tenants")
        
    finally:
        session.close()

@celery.task
def hourly_priority_company_check():
    """
    Hourly check for high-priority companies
    """
    session = Session()
    try:
        # Get high-priority companies (e.g., key accounts)
        companies = session.execute(
            """SELECT c.id, c.company_number, c.tenant_id, c.last_companies_house_check
               FROM companies c
               JOIN company_monitoring_config cfg ON c.id = cfg.company_id
               WHERE cfg.priority = 'high' AND cfg.is_active = TRUE"""
        ).fetchall()
        
        for company in companies:
            check_company_changes.delay(
                company_id=company[0],
                company_number=company[1],
                tenant_id=company[2],
                last_check=company[3]
            )
        
        logger.info(f"Triggered priority check for {len(companies)} companies")
        
    finally:
        session.close()

def _is_recent_date(date_str: Optional[str], days: int = 30) -> bool:
    """Helper: Check if date is within recent period"""
    if not date_str:
        return False
    try:
        date = datetime.strptime(date_str, '%Y-%m-%d')
        return (datetime.now() - date).days <= days
    except:
        return False