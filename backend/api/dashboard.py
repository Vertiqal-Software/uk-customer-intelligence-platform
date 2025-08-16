from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models.user import db, User, Company, Alert
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api')

@dashboard_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard():
    """Get dashboard data for authenticated user."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        # Get stats for user's tenant
        watched_companies = Company.query.filter_by(
            tenant_id=user.tenant_id,
            is_monitored=True
        ).all()
        
        recent_alerts = Alert.query.filter_by(
            tenant_id=user.tenant_id
        ).order_by(Alert.created_at.desc()).limit(10).all()
        
        unread_alerts = Alert.query.filter_by(
            tenant_id=user.tenant_id,
            is_read=False
        ).count()
        
        response = {
            'user': user.to_dict(),
            'stats': {
                'total_watched_companies': len(watched_companies),
                'unread_alerts': unread_alerts,
                'tenant_name': user.tenant.name if user.tenant else 'Unknown'
            },
            'watched_companies': [
                {
                    'id': c.id,
                    'company_number': c.company_number,
                    'company_name': c.company_name,
                    'status': c.company_status or 'active',
                    'last_check': c.last_fetched_at.isoformat() if c.last_fetched_at else None
                } for c in watched_companies[:10]
            ],
            'recent_alerts': [
                {
                    'id': a.id,
                    'title': a.title,
                    'message': a.description,
                    'company_name': a.company.company_name if a.company else 'Unknown',
                    'created_at': a.created_at.isoformat(),
                    'is_read': a.is_read
                } for a in recent_alerts
            ]
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        logger.error(f"Dashboard error: {str(e)}")
        return jsonify({'error': 'Failed to load dashboard data'}), 500

@dashboard_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    try:
        # Test database connection
        db.session.execute('SELECT 1')
        db_status = 'ready'
    except:
        db_status = 'error'
    
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'services': {
            'database': db_status,
            'companies_house': 'ready'
        }
    }), 200