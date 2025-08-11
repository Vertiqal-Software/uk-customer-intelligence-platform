from . import celery

@celery.task
def ping():
    """Simple test task."""
    return "pong"
