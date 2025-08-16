# backend/__init__.py
"""
Backend package init.

We expose a single Celery instance as `backend.celery` to keep CLI compatibility:
  celery -A backend worker|flower ...

The canonical definition lives in backend.celery_app.
"""
from .celery_app import celery  # re-export for backward compatibility
