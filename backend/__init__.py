import os
from celery import Celery

# 1) Instantiate the Celery app
celery = Celery(
    "uk_customer_intelligence",
    broker=os.getenv("REDIS_URL", "redis://redis:6379/0"),
    backend=os.getenv("REDIS_URL", "redis://redis:6379/0"),
)

# 2) (Optional) configure any Celery settings here
celery.conf.update(
    task_track_started=True,
    result_expires=3600,
)

# 3) Auto-discover tasks in this package
celery.autodiscover_tasks(['backend.tasks.data_ingestion'])
