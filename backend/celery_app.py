# backend/celery_app.py
import os
from celery import Celery

def _redis_url_default() -> str:
    return os.getenv("REDIS_URL", "redis://redis:6379/0")

BROKER_URL = os.getenv("CELERY_BROKER_URL", _redis_url_default())
RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", _redis_url_default())

celery = Celery(
    "uk_customer_intelligence",
    broker=BROKER_URL,
    backend=RESULT_BACKEND,
)

# sensible defaults; keep parity with your current init
celery.conf.update(
    task_track_started=True,
    result_expires=3600,
)

# autodiscover tasks under backend.tasks.*
celery.autodiscover_tasks(["backend.tasks"])
