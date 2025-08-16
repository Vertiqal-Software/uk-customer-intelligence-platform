# backend/tasks/health.py
from backend.celery_app import celery

@celery.task(name="health.ping")
def ping():
    return "pong"
