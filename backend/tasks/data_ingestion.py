from backend.tasks import celery

@celery.task
def ping():
    """Simple test task to verify Celery is working."""
    return "pong"

@celery.task
def ingest_company_data(company_id):
    """Placeholder for company data ingestion."""
    # TODO: Implement actual data ingestion logic
    return f"Data ingestion started for company {company_id}"

@celery.task
def refresh_financial_data(company_id):
    """Placeholder for financial data refresh."""
    # TODO: Implement financial data refresh from Companies House
    return f"Financial data refresh completed for company {company_id}"