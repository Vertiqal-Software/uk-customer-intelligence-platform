import os
import requests
import logging
from datetime import datetime, timedelta
from celery import Celery
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Celery
celery = Celery(
    "uk_customer_intelligence",
    broker=os.getenv("REDIS_URL", "redis://redis:6379/0"),
    backend=os.getenv("REDIS_URL", "redis://redis:6379/0"),
)

# Celery configuration
celery.conf.update(
    task_track_started=True,
    result_expires=3600,
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_routes={
        'backend.tasks.monitor_companies': {'queue': 'monitoring'},
        'backend.tasks.fetch_company_updates': {'queue': 'updates'},
        'backend.tasks.send_alerts': {'queue': 'alerts'},
    }
)

# Database setup for tasks
def get_db_session():
    """Get database session for tasks"""
    database_url = os.getenv("DATABASE_URL", "postgresql://devuser:devpass@db:5432/uk_customer_intelligence")
    engine = create_engine(database_url)
    Session = sessionmaker(bind=engine)
    return Session()

# Companies House API Helper
def fetch_company_data(company_number, api_key):
    """Fetch company data from Companies House API"""
    url = f"https://api.company-information.service.gov.uk/company/{company_number}"
    headers = {
        'Authorization': f'Basic {api_key}:'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            return response.json()
        else:
            logger.error(f"Companies House API error for {company_number}: {response.status_code}")
            return None
    except requests.RequestException as e:
        logger.error(f"Companies House API request failed for {company_number}: {e}")
        return None

# Core Tasks
@celery.task(bind=True, max_retries=3)
def ping(self):
    """Simple health check task"""
    return "pong"

@celery.task(bind=True, max_retries=3)
def monitor_companies(self):
    """
    Monitor all companies for changes and generate alerts
    This task runs periodically to check for updates
    """
    try:
        session = get_db_session()
        api_key = os.getenv("COMPANIES_HOUSE_API_KEY")
        
        if not api_key:
            logger.error("Companies House API key not configured")
            return {"status": "error", "message": "API key not configured"}
        
        # Get all monitored companies
        query = text("""
            SELECT c.id, c.companies_house_number, c.name, c.status, c.tenant_id,
                   c.updated_at, t.name as tenant_name
            FROM companies c 
            JOIN tenants t ON c.tenant_id = t.id 
            WHERE c.is_monitored = true AND t.is_active = true
            ORDER BY c.updated_at ASC
            LIMIT 50
        """)
        
        result = session.execute(query)
        companies = result.fetchall()
        
        updates_found = 0
        alerts_created = 0
        
        for company in companies:
            try:
                # Fetch current data from Companies House
                current_data = fetch_company_data(company.companies_house_number, api_key)
                
                if not current_data:
                    continue
                
                # Check for status changes
                new_status = current_data.get('company_status')
                if new_status and new_status != company.status:
                    # Update company status
                    update_query = text("""
                        UPDATE companies 
                        SET status = :new_status, updated_at = CURRENT_TIMESTAMP 
                        WHERE id = :company_id
                    """)
                    session.execute(update_query, {
                        'new_status': new_status,
                        'company_id': company.id
                    })
                    
                    # Create alert
                    alert_query = text("""
                        INSERT INTO alerts (tenant_id, company_id, alert_type, title, description, severity)
                        VALUES (:tenant_id, :company_id, 'status_change', :title, :description, 'medium')
                    """)
                    session.execute(alert_query, {
                        'tenant_id': company.tenant_id,
                        'company_id': company.id,
                        'title': f'Status Change: {company.name}',
                        'description': f'Company status changed from {company.status} to {new_status}'
                    })
                    
                    alerts_created += 1
                    updates_found += 1
                    logger.info(f"Status change detected for {company.name}: {company.status} -> {new_status}")
                
                # Check for new filings (simplified - would need filing history API)
                accounts = current_data.get('accounts', {})
                if accounts.get('next_accounts', {}).get('due_on'):
                    due_date = accounts['next_accounts']['due_on']
                    # Check if due date is approaching (within 30 days)
                    try:
                        due_datetime = datetime.strptime(due_date, '%Y-%m-%d')
                        days_until_due = (due_datetime - datetime.now()).days
                        
                        if 0 <= days_until_due <= 30:
                            # Check if we already have a recent alert for this
                            recent_alert_query = text("""
                                SELECT COUNT(*) as count FROM alerts 
                                WHERE company_id = :company_id 
                                AND alert_type = 'filing_due' 
                                AND created_at > CURRENT_TIMESTAMP - INTERVAL '7 days'
                            """)
                            recent_alert = session.execute(recent_alert_query, {'company_id': company.id}).fetchone()
                            
                            if recent_alert.count == 0:
                                alert_query = text("""
                                    INSERT INTO alerts (tenant_id, company_id, alert_type, title, description, severity)
                                    VALUES (:tenant_id, :company_id, 'filing_due', :title, :description, 'high')
                                """)
                                session.execute(alert_query, {
                                    'tenant_id': company.tenant_id,
                                    'company_id': company.id,
                                    'title': f'Filing Due: {company.name}',
                                    'description': f'Accounts filing due on {due_date} ({days_until_due} days remaining)'
                                })
                                alerts_created += 1
                    except ValueError:
                        pass  # Invalid date format
                
            except Exception as e:
                logger.error(f"Error monitoring company {company.name}: {e}")
                continue
        
        session.commit()
        session.close()
        
        logger.info(f"Company monitoring complete: {updates_found} updates, {alerts_created} alerts created")
        return {
            "status": "success",
            "companies_checked": len(companies),
            "updates_found": updates_found,
            "alerts_created": alerts_created
        }
        
    except Exception as e:
        logger.error(f"Error in monitor_companies task: {e}")
        self.retry(countdown=60 * (self.request.retries + 1))

@celery.task(bind=True, max_retries=3)
def fetch_company_updates(self, company_id):
    """
    Fetch updates for a specific company
    """
    try:
        session = get_db_session()
        api_key = os.getenv("COMPANIES_HOUSE_API_KEY")
        
        # Get company details
        query = text("""
            SELECT companies_house_number, name, tenant_id 
            FROM companies 
            WHERE id = :company_id AND is_monitored = true
        """)
        result = session.execute(query, {'company_id': company_id}).fetchone()
        
        if not result:
            return {"status": "error", "message": "Company not found or not monitored"}
        
        # Fetch latest data
        current_data = fetch_company_data(result.companies_house_number, api_key)
        if not current_data:
            return {"status": "error", "message": "Failed to fetch company data"}
        
        # Update company information
        update_query = text("""
            UPDATE companies 
            SET 
                name = :name,
                status = :status,
                address_line_1 = :address_line_1,
                address_line_2 = :address_line_2,
                locality = :locality,
                postal_code = :postal_code,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :company_id
        """)
        
        address = current_data.get('registered_office_address', {})
        session.execute(update_query, {
            'company_id': company_id,
            'name': current_data.get('company_name', result.name),
            'status': current_data.get('company_status'),
            'address_line_1': address.get('address_line_1'),
            'address_line_2': address.get('address_line_2'),
            'locality': address.get('locality'),
            'postal_code': address.get('postal_code')
        })
        
        session.commit()
        session.close()
        
        return {"status": "success", "company": result.name, "updated": True}
        
    except Exception as e:
        logger.error(f"Error in fetch_company_updates task: {e}")
        self.retry(countdown=60 * (self.request.retries + 1))

@celery.task(bind=True, max_retries=3)
def send_alerts(self, tenant_id, alert_type=None):
    """
    Send alerts to users (email notifications, etc.)
    Currently logs alerts - can be extended for email/SMS
    """
    try:
        session = get_db_session()
        
        # Get unread alerts for tenant
        where_clause = "WHERE a.tenant_id = :tenant_id AND a.is_read = false"
        params = {'tenant_id': tenant_id}
        
        if alert_type:
            where_clause += " AND a.alert_type = :alert_type"
            params['alert_type'] = alert_type
        
        query = text(f"""
            SELECT a.id, a.title, a.description, a.severity, a.alert_type,
                   c.name as company_name, c.companies_house_number,
                   u.email, u.first_name, u.last_name
            FROM alerts a
            JOIN companies c ON a.company_id = c.id
            JOIN users u ON a.tenant_id = u.tenant_id
            {where_clause}
            ORDER BY a.created_at DESC
            LIMIT 50
        """)
        
        result = session.execute(query, params)
        alerts = result.fetchall()
        
        # Group alerts by user
        user_alerts = {}
        for alert in alerts:
            if alert.email not in user_alerts:
                user_alerts[alert.email] = {
                    'user': f"{alert.first_name} {alert.last_name}",
                    'alerts': []
                }
            user_alerts[alert.email]['alerts'].append(alert)
        
        # Send notifications (currently just log)
        notifications_sent = 0
        for email, data in user_alerts.items():
            try:
                # Here you would integrate with email service (SendGrid, AWS SES, etc.)
                logger.info(f"Sending {len(data['alerts'])} alerts to {data['user']} ({email})")
                
                for alert in data['alerts']:
                    logger.info(f"Alert: {alert.title} - {alert.description}")
                
                notifications_sent += 1
                
                # In a real implementation, you'd mark alerts as sent after successful email
                # For now, we'll just log them
                
            except Exception as e:
                logger.error(f"Error sending alerts to {email}: {e}")
        
        session.close()
        
        return {
            "status": "success",
            "alerts_processed": len(alerts),
            "notifications_sent": notifications_sent
        }
        
    except Exception as e:
        logger.error(f"Error in send_alerts task: {e}")
        self.retry(countdown=60 * (self.request.retries + 1))

@celery.task(bind=True, max_retries=3)
def cleanup_old_data(self):
    """
    Cleanup old alerts and logs
    """
    try:
        session = get_db_session()
        
        # Delete read alerts older than 30 days
        cleanup_query = text("""
            DELETE FROM alerts 
            WHERE is_read = true 
            AND created_at < CURRENT_TIMESTAMP - INTERVAL '30 days'
        """)
        result = session.execute(cleanup_query)
        alerts_deleted = result.rowcount
        
        # Delete old news articles (if any) older than 90 days
        news_cleanup_query = text("""
            DELETE FROM news_articles 
            WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '90 days'
        """)
        result = session.execute(news_cleanup_query)
        news_deleted = result.rowcount
        
        session.commit()
        session.close()
        
        logger.info(f"Cleanup complete: {alerts_deleted} alerts, {news_deleted} news articles deleted")
        return {
            "status": "success",
            "alerts_deleted": alerts_deleted,
            "news_deleted": news_deleted
        }
        
    except Exception as e:
        logger.error(f"Error in cleanup_old_data task: {e}")
        self.retry(countdown=60 * (self.request.retries + 1))

# Periodic task setup (would be configured with celery beat)
@celery.task
def setup_periodic_tasks():
    """
    Setup periodic tasks - call this once to register them
    """
    from celery.schedules import crontab
    
    # Monitor companies every 6 hours
    celery.add_periodic_task(
        crontab(minute=0, hour='*/6'),
        monitor_companies.s(),
        name='monitor-companies'
    )
    
    # Cleanup old data daily at 2 AM
    celery.add_periodic_task(
        crontab(hour=2, minute=0),
        cleanup_old_data.s(),
        name='cleanup-old-data'
    )
    
    return "Periodic tasks configured"

# Task for testing
@celery.task
def test_companies_house_api():
    """Test Companies House API connectivity"""
    api_key = os.getenv("COMPANIES_HOUSE_API_KEY")
    if not api_key:
        return {"status": "error", "message": "API key not configured"}
    
    # Test with a known company (Marks & Spencer)
    test_data = fetch_company_data("00000006", api_key)
    
    if test_data:
        return {
            "status": "success",
            "message": "Companies House API is working",
            "test_company": test_data.get('company_name', 'Unknown')
        }
    else:
        return {
            "status": "error", 
            "message": "Companies House API test failed"
        }

if __name__ == "__main__":
    # For testing individual tasks
    print("Testing Companies House API...")
    result = test_companies_house_api()
    print(f"Result: {result}")