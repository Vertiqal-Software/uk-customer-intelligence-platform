import os
import uuid
import base64
import re
import secrets
import json
from datetime import datetime, timedelta
from functools import wraps

import requests
from flask import Flask, jsonify, request, g
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import text, event
from werkzeug.security import generate_password_hash, check_password_hash
from redis import Redis

# -----------------------------------------------------------------------------
# Tiny .env loader (no extra packages)
# -----------------------------------------------------------------------------
def _load_env_file():
    """
    Load key=value pairs from a .env file next to this app.py.
    Only sets variables that aren't already in the environment.
    """
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
    if not os.path.exists(env_path):
        return
    try:
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                k = k.strip()
                v = v.strip().strip('"').strip("'")
                os.environ.setdefault(k, v)
    except Exception:
        # Fail open if the .env has odd formatting
        pass

# Load .env right away so config sees it
_load_env_file()

# Normalize postgres URL to psycopg3 dialect
def _normalize_db_url(url: str | None) -> str | None:
    if not url:
        return url
    if url.startswith("postgres://"):
        return "postgresql+psycopg://" + url[len("postgres://"):]
    if url.startswith("postgresql://") and "+psycopg" not in url:
        return "postgresql+psycopg://" + url[len("postgresql://"):]
    return url

# -----------------------------------------------------------------------------
# Extensions
# -----------------------------------------------------------------------------
db = SQLAlchemy()
jwt = JWTManager()
limiter = Limiter(key_func=get_remote_address, default_limits=["1000 per hour"])
redis_client: Redis | None = None

# -----------------------------------------------------------------------------
# Helpers
# -----------------------------------------------------------------------------
def _slugify(text_: str) -> str:
    s = re.sub(r'[^a-zA-Z0-9]+', '-', (text_ or '')).strip('-').lower()
    return s or 'tenant'

def _iso_or_none(d: datetime | None):
    return d.isoformat() if d else None

def _bool(val, default=False):
    return default if val is None else bool(val)

def _env(name: str, default: str | None = None) -> str | None:
    v = os.getenv(name)
    return v if (v is not None and v != "") else default

# -----------------------------------------------------------------------------
# App Factory
# -----------------------------------------------------------------------------
def create_app():
    app = Flask(__name__)

    # -------------------------------------------------------------------------
    # Config
    # -------------------------------------------------------------------------
    app.config["SQLALCHEMY_DATABASE_URI"] = _normalize_db_url(_env(
        "DATABASE_URL",
        "postgresql+psycopg://devuser:devpass@db:5432/uk_customer_intelligence"
    ))
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    app.config["SECRET_KEY"] = _env("SECRET_KEY", "change-me-in-production")
    app.config["JWT_SECRET_KEY"] = _env("JWT_SECRET_KEY", "jwt-secret-change-me")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

    # Companies House API key (required for /companies/* routes)
    app.config["COMPANIES_HOUSE_API_KEY"] = _env("COMPANIES_HOUSE_API_KEY", "")

    # 🔧 Respect .env CORS_ORIGINS (comma-separated); fallback to localhost:3000
    cors_origins_env = _env("CORS_ORIGINS", "http://localhost:3000")
    cors_origins = [o.strip() for o in cors_origins_env.split(",") if o.strip()]
    CORS(app, origins=cors_origins)

    # 🔧 Make Flask-Limiter use Redis if provided (removes in-memory warning)
    app.config["RATELIMIT_STORAGE_URI"] = _env("RATE_LIMIT_STORAGE_URL", "memory://")

    # Init extensions
    db.init_app(app)
    jwt.init_app(app)
    limiter.init_app(app)

    # Redis (for password reset tokens and rate limit store if configured)
    redis_url = _env("REDIS_URL", "redis://redis:6379/0")
    try:
        global redis_client
        redis_client = Redis.from_url(redis_url, decode_responses=True)
        app.logger.info(f"Redis ready: {redis_url}")
    except Exception as e:
        app.logger.error(f"Redis init failed: {e}")

    # Small boot summary (nice for debugging in logs)
    app.logger.info(f"CORS origins: {cors_origins}")
    app.logger.info(f"Rate limit storage: {app.config.get('RATELIMIT_STORAGE_URI')}")

    # -------------------------------------------------------------------------
    # Models
    # -------------------------------------------------------------------------
    class Tenant(db.Model):
        __tablename__ = "tenants"

        id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
        name = db.Column(db.String(255), nullable=False)
        slug = db.Column(db.String(255), nullable=False, unique=True)
        subscription_tier = db.Column(db.String(50), default="basic")
        is_active = db.Column(db.Boolean, default=True)
        created_at = db.Column(db.DateTime, default=datetime.utcnow)
        updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

        # relationships
        users = db.relationship("User", backref="tenant", lazy=True, cascade="all, delete-orphan")
        companies = db.relationship("Company", backref="tenant", lazy=True, cascade="all, delete-orphan")

    @event.listens_for(Tenant, "before_insert")
    def _tenant_slug_before_insert(mapper, connection, target):
        if not getattr(target, "slug", None):
            target.slug = _slugify(target.name)

    @event.listens_for(Tenant, "before_update")
    def _tenant_slug_before_update(mapper, connection, target):
        if not getattr(target, "slug", None):
            target.slug = _slugify(target.name)

    class User(db.Model):
        __tablename__ = "users"

        id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
        email = db.Column(db.String(255), unique=True, nullable=False)
        password_hash = db.Column(db.String(255), nullable=False)
        first_name = db.Column(db.String(100))
        last_name = db.Column(db.String(100))
        tenant_id = db.Column(UUID(as_uuid=True), db.ForeignKey("tenants.id"), nullable=False)
        is_active = db.Column(db.Boolean, default=True)
        created_at = db.Column(db.DateTime, default=datetime.utcnow)
        updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

        def set_password(self, password: str):
            self.password_hash = generate_password_hash(password)

        def check_password(self, password: str) -> bool:
            return check_password_hash(self.password_hash, password)

        def to_dict(self):
            return {
                "id": str(self.id),
                "email": self.email,
                "first_name": self.first_name,
                "last_name": self.last_name,
                "tenant_id": str(self.tenant_id),
                "is_active": self.is_active,
            }

    class Company(db.Model):
        """
        Matches your current DB table:

        - company_number: NOT NULL
        - unique (tenant_id, company_number)
        - several optional columns are present; we map the ones we use directly.
        """
        __tablename__ = "companies"

        id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
        tenant_id = db.Column(UUID(as_uuid=True), db.ForeignKey("tenants.id"), nullable=False)

        # Canonical identifiers/names
        company_number = db.Column(db.String(20), nullable=False)
        company_name = db.Column(db.String(255))
        company_status = db.Column(db.String(50))

        # Frequently used basic profile
        incorporation_date = db.Column(db.Date)
        address_line_1 = db.Column(db.String(255))
        address_line_2 = db.Column(db.String(255))
        locality = db.Column(db.String(100))
        postal_code = db.Column(db.String(20))
        country = db.Column(db.String(100), default="United Kingdom")
        sic_codes = db.Column(db.ARRAY(db.String))  # DB has text[] (compatible)

        is_monitored = db.Column(db.Boolean, default=False)

        # Timestamps
        created_at = db.Column(db.DateTime, default=datetime.utcnow)
        updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

        __table_args__ = (
            db.UniqueConstraint("tenant_id", "company_number", name="companies_tenant_id_company_number_key"),
        )

        def to_dict(self):
            return {
                "id": str(self.id),
                "company_number": self.company_number,
                "company_name": self.company_name,
                "company_status": self.company_status,
                "incorporation_date": self.incorporation_date.isoformat() if self.incorporation_date else None,
                "address_line_1": self.address_line_1,
                "address_line_2": self.address_line_2,
                "locality": self.locality,
                "postal_code": self.postal_code,
                "country": self.country,
                "sic_codes": self.sic_codes,
                "is_monitored": self.is_monitored,
                "created_at": _iso_or_none(self.created_at),
                "updated_at": _iso_or_none(self.updated_at),
            }

    class Alert(db.Model):
        __tablename__ = "alerts"

        id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
        tenant_id = db.Column(UUID(as_uuid=True), db.ForeignKey("tenants.id"), nullable=False)
        company_id = db.Column(UUID(as_uuid=True), db.ForeignKey("companies.id"))  # nullable OK
        alert_type = db.Column(db.String(100), nullable=False)
        title = db.Column(db.String(255), nullable=False)
        description = db.Column(db.Text)
        severity = db.Column(db.String(20), default="medium")
        is_read = db.Column(db.Boolean, default=False)
        created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # -------------------------------------------------------------------------
    # Multi-tenant guard
    # -------------------------------------------------------------------------

    # -------------------------------------------------------------------------
    # NEW MODELS: Integrations, Pipeline, Prospects (non-destructive additions)
    # -------------------------------------------------------------------------
    class IntegrationConfig(db.Model):
        __tablename__ = "integration_configs"
        id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
        tenant_id = db.Column(UUID(as_uuid=True), db.ForeignKey("tenants.id"), nullable=False)
        service = db.Column(db.String(100), nullable=False)  # e.g., 'clearbit', 'hubspot'
        status = db.Column(db.String(20), default="disconnected")  # connected, error, disconnected
        config = db.Column(db.JSON, default=dict)
        connected_at = db.Column(db.DateTime, nullable=True)
        created_at = db.Column(db.DateTime, default=datetime.utcnow)
        updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
        __table_args__ = (db.UniqueConstraint("tenant_id", "service", name="uq_integration_tenant_service"),)

        def to_dict(self):
            return {
                "id": str(self.id),
                "service": self.service,
                "status": self.status,
                "config": self.config or {},
                "connected_at": _iso_or_none(self.connected_at),
                "created_at": _iso_or_none(self.created_at),
                "updated_at": _iso_or_none(self.updated_at),
            }

    class PipelineStage(db.Model):
        __tablename__ = "pipeline_stages"
        id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
        tenant_id = db.Column(UUID(as_uuid=True), db.ForeignKey("tenants.id"), nullable=False)
        name = db.Column(db.String(100), nullable=False)
        order_index = db.Column(db.Integer, nullable=False, default=0)
        probability = db.Column(db.Integer, default=0)  # 0..100
        created_at = db.Column(db.DateTime, default=datetime.utcnow)
        updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
        __table_args__ = (db.UniqueConstraint("tenant_id", "name", name="uq_stage_tenant_name"),)

        def to_dict(self):
            return {
                "id": str(self.id),
                "name": self.name,
                "order_index": self.order_index,
                "probability": self.probability,
            }

    class Prospect(db.Model):
        __tablename__ = "prospects"
        id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
        tenant_id = db.Column(UUID(as_uuid=True), db.ForeignKey("tenants.id"), nullable=False)
        company_id = db.Column(UUID(as_uuid=True), db.ForeignKey("companies.id"), nullable=True)
        owner_user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=True)
        first_name = db.Column(db.String(100))
        last_name = db.Column(db.String(100))
        title = db.Column(db.String(150))
        email = db.Column(db.String(255))
        phone = db.Column(db.String(50))
        linkedin_url = db.Column(db.String(300))
        source = db.Column(db.String(100))  # import, manual, linkedin
        status = db.Column(db.String(50), default="new")  # new, contacted, qualified, unqualified, archived
        tags = db.Column(db.ARRAY(db.String))
        notes = db.Column(db.Text)
        created_at = db.Column(db.DateTime, default=datetime.utcnow)
        updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

        def to_dict(self):
            return {
                "id": str(self.id),
                "company_id": str(self.company_id) if self.company_id else None,
                "owner_user_id": str(self.owner_user_id) if self.owner_user_id else None,
                "first_name": self.first_name,
                "last_name": self.last_name,
                "title": self.title,
                "email": self.email,
                "phone": self.phone,
                "linkedin_url": self.linkedin_url,
                "source": self.source,
                "status": self.status,
                "tags": self.tags or [],
                "notes": self.notes,
                "created_at": _iso_or_none(self.created_at),
                "updated_at": _iso_or_none(self.updated_at),
            }

    class Deal(db.Model):
        __tablename__ = "deals"
        id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
        tenant_id = db.Column(UUID(as_uuid=True), db.ForeignKey("tenants.id"), nullable=False)
        company_id = db.Column(UUID(as_uuid=True), db.ForeignKey("companies.id"), nullable=True)
        prospect_id = db.Column(UUID(as_uuid=True), db.ForeignKey("prospects.id"), nullable=True)
        stage_id = db.Column(UUID(as_uuid=True), db.ForeignKey("pipeline_stages.id"), nullable=True)
        title = db.Column(db.String(255), nullable=False)
        value_amount = db.Column(db.Numeric(12, 2), default=0)
        currency = db.Column(db.String(3), default="GBP")
        status = db.Column(db.String(30), default="open")  # open, won, lost, on_hold
        expected_close_date = db.Column(db.Date, nullable=True)
        created_at = db.Column(db.DateTime, default=datetime.utcnow)
        updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

        def to_dict(self):
            return {
                "id": str(self.id),
                "title": self.title,
                "company_id": str(self.company_id) if self.company_id else None,
                "prospect_id": str(self.prospect_id) if self.prospect_id else None,
                "stage_id": str(self.stage_id) if self.stage_id else None,
                "value_amount": float(self.value_amount or 0),
                "currency": self.currency,
                "status": self.status,
                "expected_close_date": self.expected_close_date.isoformat() if self.expected_close_date else None,
                "created_at": _iso_or_none(self.created_at),
                "updated_at": _iso_or_none(self.updated_at),
            }
    def require_tenant():
        def decorator(f):
            @wraps(f)
            def decorated_function(*args, **kwargs):
                user_id = get_jwt_identity()
                if not user_id:
                    return jsonify({"error": "Token required"}), 401

                # 🔧 Be robust to string UUIDs in JWT identity
                lookup_id = user_id
                try:
                    lookup_id = uuid.UUID(str(user_id))
                except Exception:
                    pass

                user = User.query.get(lookup_id)
                if not user or not user.is_active:
                    return jsonify({"error": "Invalid user"}), 401
                g.current_user = user
                g.tenant_id = user.tenant_id
                return f(*args, **kwargs)
            return decorated_function
        return decorator

    # -------------------------------------------------------------------------
    # Companies House helpers
    # -------------------------------------------------------------------------
    def _ch_headers():
        key = app.config.get("COMPANIES_HOUSE_API_KEY", "")
        if not key:
            app.logger.warning("Companies House API key missing; calls disabled.")
            return None
        # Basic auth with key as username, blank password
        auth = base64.b64encode(f"{key}:".encode("ascii")).decode("ascii")
        return {"Authorization": f"Basic {auth}"}

    def search_companies_house(query, max_results=20):
        """
        https://developer.company-information.service.gov.uk/advanced-search/companies
        This hits: /search/companies?q=
        """
        headers = _ch_headers() or {}
        if not headers:
            return {"error": "api_key_missing"}

        url = "https://api.company-information.service.gov.uk/search/companies"
        params = {"q": query, "items_per_page": min(max_results, 20)}
        try:
            r = requests.get(url, headers=headers, params=params, timeout=10)
            if r.status_code == 200:
                return r.json()
            app.logger.error(f"Companies House search error: {r.status_code} - {r.text[:200]}")
            return None
        except requests.RequestException as e:
            app.logger.error(f"Companies House search request failed: {e}")
            return None

    def get_company_details(company_number: str):
        """
        https://api.company-information.service.gov.uk/company/{company_number}
        """
        headers = _ch_headers() or {}
        if not headers:
            return {"error": "api_key_missing"}

        url = f"https://api.company-information.service.gov.uk/company/{company_number}"
        try:
            r = requests.get(url, headers=headers, timeout=10)
            if r.status_code == 200:
                return r.json()
            app.logger.error(f"Companies House details error: {r.status_code} - {r.text[:200]}")
            return None
        except requests.RequestException as e:
            app.logger.error(f"Companies House details request failed: {e}")
            return None

    # -------------------------------------------------------------------------
    # Routes
    # -------------------------------------------------------------------------
    @app.route("/api/health")
    def health():
        try:
            db.session.execute(text("SELECT 1"))
            db_status = "healthy"
        except Exception as e:
            db_status = f"unhealthy: {str(e)}"
        return jsonify({
            "status": "healthy",
            "version": "1.0.0",
            "database": db_status,
            "features": {
                "multi_tenant": True,
                "ai_powered": True,
                "uk_compliant": True,
                "gdpr_compliant": True,
            },
        })

    # ----- Auth -----
    @app.route("/api/auth/login", methods=["POST"])
    @limiter.limit("5 per minute")
    def login():
        data = request.get_json(silent=True) or {}
        if not data.get("email") or not data.get("password"):
            return jsonify({"error": "Email and password required"}), 400

        user = User.query.filter_by(email=data["email"]).first()
        if not user or not user.check_password(data["password"]) or not user.is_active:
            return jsonify({"error": "Invalid credentials"}), 401

        token = create_access_token(identity=str(user.id))
        return jsonify({"access_token": token, "user": user.to_dict()})

    @app.route("/api/auth/register", methods=["POST"])
    @limiter.limit("3 per minute")
    def register():
        data = request.get_json(silent=True) or {}
        required = ["email", "password", "first_name", "last_name", "company_name"]
        if not all(data.get(k) for k in required):
            return jsonify({"error": "All fields required"}), 400

        if User.query.filter_by(email=data["email"]).first():
            return jsonify({"error": "Email already registered"}), 400

        tenant = Tenant(name=data["company_name"], slug=_slugify(data["company_name"]))
        db.session.add(tenant)
        db.session.flush()

        user = User(
            email=data["email"],
            first_name=data["first_name"],
            last_name=data["last_name"],
            tenant_id=tenant.id,
            is_active=True
        )
        user.set_password(data["password"])
        db.session.add(user)
        db.session.commit()

        token = create_access_token(identity=str(user.id))
        return jsonify({"access_token": token, "user": user.to_dict()}), 201

    @app.route("/api/auth/me", methods=["GET"])
    @jwt_required()
    @require_tenant()
    def get_current_user():
        u = g.current_user
        return jsonify({
            "user": u.to_dict(),
            "tenant": {
                "id": str(u.tenant.id),
                "name": u.tenant.name,
                "subscription_tier": u.tenant.subscription_tier
            }
        })

    # ----- Password reset (added) -----
    @app.route("/api/auth/forgot-password", methods=["POST"])
    @limiter.limit("5 per hour")
    def forgot_password():
        """
        Issue a single-use, short-lived reset token and log a reset link.
        Always return a generic 200 to avoid account enumeration.
        """
        if redis_client is None:
            return jsonify({"error": "Reset service unavailable"}), 503

        data = request.get_json(silent=True) or {}
        email = (data.get("email") or "").strip().lower()

        # Generic response regardless of user existence
        msg = {"message": "If the email exists, a reset link has been sent."}

        if not email:
            return jsonify(msg), 200

        user = User.query.filter_by(email=email).first()
        if user:
            token = secrets.token_urlsafe(32)  # ~256 bits entropy
            payload = {"user_id": str(user.id), "iat": datetime.utcnow().isoformat()}
            # 15 minutes TTL
            redis_client.setex(f"pwdreset:{token}", timedelta(minutes=15), json.dumps(payload))
            reset_link = f"{_env('FRONTEND_URL', 'http://localhost:3000')}/reset-password/{token}"
            # In dev we log it; in prod you'd send the email.
            app.logger.info(f"[DEV] Password reset for {email}: {reset_link}")

        return jsonify(msg), 200

    @app.route("/api/auth/reset-password", methods=["POST"])
    @limiter.limit("10 per hour")
    def reset_password():
        """
        Consume a reset token and set a new password.
        Token is single-use; we delete it after success (or if invalid).
        """
        if redis_client is None:
            return jsonify({"error": "Reset service unavailable"}), 503

        data = request.get_json(silent=True) or {}
        token = (data.get("token") or "").strip()
        new_password = (data.get("new_password") or "").strip()

        if not token or not new_password:
            return jsonify({"error": "Token and new password are required"}), 400

        if len(new_password) < 8:
            return jsonify({"error": "Password must be at least 8 characters"}), 400

        key = f"pwdreset:{token}"
        raw = redis_client.get(key)
        if not raw:
            return jsonify({"error": "Invalid or expired reset token"}), 400

        # Parse and delete token to ensure single-use
        try:
            payload = json.loads(raw)
        except Exception:
            payload = None
        finally:
            try:
                redis_client.delete(key)
            except Exception:
                pass

        if not payload or not payload.get("user_id"):
            return jsonify({"error": "Invalid reset token"}), 400

        user = User.query.get(payload["user_id"])
        if not user or not user.is_active:
            return jsonify({"error": "Invalid user"}), 400

        # Update password
        user.set_password(new_password)
        user.updated_at = datetime.utcnow()
        db.session.commit()

        # Invalidate other app state if needed (JWTs are stateless; existing tokens remain valid until expiry)
        return jsonify({"message": "Password updated successfully"}), 200

    # ----- Companies -----
    @app.route("/api/companies/search", methods=["GET"])
    @jwt_required()
    @require_tenant()
    @limiter.limit("30 per minute")
    def search_companies():
        q = (request.args.get("q") or "").strip()
        if not q:
            return jsonify({"error": "Search query required"}), 400
        if len(q) < 2:
            return jsonify({"error": "Search query too short"}), 400

        raw = search_companies_house(q)
        if raw is None:
            return jsonify({"error": "Search service unavailable"}), 503
        if isinstance(raw, dict) and raw.get("error") == "api_key_missing":
            return jsonify({"error": "Companies House API key missing"}), 503

        items = raw.get("items", []) if isinstance(raw, dict) else []
        companies = []
        for item in items:
            ch_number = item.get("company_number")
            title = item.get("title")
            status = item.get("company_status")
            addr = (item.get("address") or {}) if isinstance(item.get("address"), dict) else {}

            existing = None
            if ch_number:
                existing = Company.query.filter_by(
                    tenant_id=g.tenant_id, company_number=ch_number
                ).first()

            companies.append({
                "companies_house_number": ch_number,
                "name": title,
                "status": status,
                "incorporation_date": item.get("date_of_creation"),
                "address": {
                    "address_line_1": addr.get("address_line_1"),
                    "address_line_2": addr.get("address_line_2"),
                    "locality": addr.get("locality"),
                    "postal_code": addr.get("postal_code"),
                    "country": addr.get("country"),
                },
                "is_monitored": bool(existing)
            })

        return jsonify({"companies": companies, "total_results": raw.get("total_results", 0)})

    @app.route("/api/companies/<company_number>", methods=["GET"])
    @jwt_required()
    @require_tenant()
    @limiter.limit("60 per minute")
    def get_company(company_number):
        company = Company.query.filter_by(
            tenant_id=g.tenant_id, company_number=company_number
        ).first()

        ch = get_company_details(company_number)
        if ch is None:
            return jsonify({"error": "Company not found"}), 404
        if isinstance(ch, dict) and ch.get("error") == "api_key_missing":
            return jsonify({"error": "Companies House API key missing"}), 503

        sic_codes = []
        if isinstance(ch.get("sic_codes"), list):
            for s in ch.get("sic_codes"):
                if isinstance(s, str):
                    sic_codes.append(s)

        info = {
            "companies_house_number": ch.get("company_number"),
            "name": ch.get("company_name"),
            "status": ch.get("company_status"),
            "incorporation_date": ch.get("date_of_creation"),
            "registered_office_address": ch.get("registered_office_address", {}),
            "sic_codes": sic_codes,
            "accounts": ch.get("accounts", {}),
            "filing_history": ch.get("filing_history", {}),
            "is_monitored": company is not None,
            "monitoring_since": company.created_at.isoformat() if company else None
        }
        return jsonify({"company": info})

    @app.route("/api/companies/<company_number>/monitor", methods=["POST"])
    @jwt_required()
    @require_tenant()
    def add_to_monitoring(company_number):
        existing = Company.query.filter_by(
            tenant_id=g.tenant_id, company_number=company_number
        ).first()
        if existing:
            return jsonify({"error": "Company already monitored"}), 400

        ch = get_company_details(company_number)
        if ch is None:
            return jsonify({"error": "Company not found"}), 404
        if isinstance(ch, dict) and ch.get("error") == "api_key_missing":
            return jsonify({"error": "Companies House API key missing"}), 503

        ro = ch.get("registered_office_address") or {}
        sic_codes = []
        if isinstance(ch.get("sic_codes"), list):
            sic_codes = [s for s in ch["sic_codes"] if isinstance(s, str)]

        company = Company(
            tenant_id=g.tenant_id,
            company_number=company_number,
            company_name=ch.get("company_name"),
            company_status=ch.get("company_status"),
            incorporation_date=datetime.strptime(ch.get("date_of_creation"), "%Y-%m-%d").date()
                if ch.get("date_of_creation") else None,
            address_line_1=ro.get("address_line_1"),
            address_line_2=ro.get("address_line_2"),
            locality=ro.get("locality"),
            postal_code=ro.get("postal_code"),
            country=ro.get("country", "United Kingdom"),
            sic_codes=sic_codes,
            is_monitored=True
        )
        db.session.add(company)

        alert = Alert(
            tenant_id=g.tenant_id,
            company_id=company.id,
            alert_type="monitoring_started",
            title=f"Now monitoring {company.company_name or company_number}",
            description=f"Company {company_number} has been added to your monitoring list.",
            severity="info",
            is_read=False
        )
        db.session.add(alert)
        db.session.commit()

        return jsonify({"message": "Company added to monitoring", "company": company.to_dict()}), 201

    @app.route("/api/companies/<company_number>/monitor", methods=["DELETE"])
    @jwt_required()
    @require_tenant()
    def remove_from_monitoring(company_number):
        company = Company.query.filter_by(
            tenant_id=g.tenant_id, company_number=company_number
        ).first()
        if not company:
            return jsonify({"error": "Company not being monitored"}), 404
        db.session.delete(company)
        db.session.commit()
        return jsonify({"message": "Company removed from monitoring"})

    @app.route("/api/companies/monitored", methods=["GET"])
    @jwt_required()
    @require_tenant()
    def get_monitored_companies():
        companies = Company.query.filter_by(
            tenant_id=g.tenant_id, is_monitored=True
        ).order_by(Company.created_at.desc()).all()
        return jsonify({
            "companies": [c.to_dict() for c in companies],
            "total": len(companies)
        })

    # ----- Dashboard & Alerts -----
    @app.route("/api/dashboard", methods=["GET"])
    @jwt_required()
    @require_tenant()
    def get_dashboard_data():
        total_companies = Company.query.filter_by(tenant_id=g.tenant_id, is_monitored=True).count()
        unread_alerts = Alert.query.filter_by(tenant_id=g.tenant_id, is_read=False).count()
        recent_alerts = Alert.query.filter_by(tenant_id=g.tenant_id).order_by(Alert.created_at.desc()).limit(5).all()
        recent_companies = Company.query.filter_by(
            tenant_id=g.tenant_id, is_monitored=True
        ).order_by(Company.created_at.desc()).limit(5).all()

        return jsonify({
            "stats": {
                "total_companies": total_companies,
                "unread_alerts": unread_alerts,
                "active_monitoring": total_companies,
                "total_insights": 0
            },
            "recent_alerts": [{
                "id": str(a.id),
                "title": a.title,
                "description": a.description,
                "severity": a.severity,
                "created_at": _iso_or_none(a.created_at),
                "is_read": a.is_read
            } for a in recent_alerts],
            "recent_companies": [c.to_dict() for c in recent_companies]
        })

    @app.route("/api/alerts", methods=["GET"])
    @jwt_required()
    @require_tenant()
    def get_alerts():
        page = request.args.get("page", 1, type=int)
        per_page = min(request.args.get("per_page", 20, type=int), 100)
        pagination = Alert.query.filter_by(tenant_id=g.tenant_id).order_by(Alert.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        return jsonify({
            "alerts": [{
                "id": str(a.id),
                "title": a.title,
                "description": a.description,
                "severity": a.severity,
                "alert_type": a.alert_type,
                "is_read": a.is_read,
                "created_at": _iso_or_none(a.created_at)
            } for a in pagination.items],
            "pagination": {
                "page": pagination.page,
                "pages": pagination.pages,
                "per_page": pagination.per_page,
                "total": pagination.total
            }
        })

    @app.route("/api/alerts/<alert_id>/read", methods=["POST"])
    @jwt_required()
    @require_tenant()
    def mark_alert_read(alert_id):
        alert = Alert.query.filter_by(id=alert_id, tenant_id=g.tenant_id).first()
        if not alert:
            return jsonify({"error": "Alert not found"}), 404
        alert.is_read = True
        db.session.commit()
        return jsonify({"message": "Alert marked as read"})

    # ----- Errors & JWT hooks -----
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Endpoint not found"}), 404

    @app.errorhandler(500)
    def internal_error(e):
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({"error": "Token has expired"}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(err):
        return jsonify({"error": "Invalid token"}), 401

    @jwt.unauthorized_loader
    def missing_token_callback(err):
        return jsonify({"error": "Token required"}), 401

    # -------------------------------------------------------------------------
    # DB init & seed (idempotent)
    # -------------------------------------------------------------------------
    with app.app_context():
        try:
            db.create_all()
            app.logger.info("Database tables created successfully")

            test_tenant = Tenant.query.filter_by(name="Demo Organization").first()
            if not test_tenant:
                test_tenant = Tenant(
                    name="Demo Organization",
                    slug=_slugify("Demo Organization"),
                    subscription_tier="professional",
                    is_active=True
                )
                db.session.add(test_tenant)
                db.session.flush()

                test_user = User(
                    email="test@example.com",
                    first_name="Test",
                    last_name="User",
                    tenant_id=test_tenant.id,
                    is_active=True
                )
                test_user.set_password("SecurePass123")
                db.session.add(test_user)

                demo_alerts = [
                    Alert(
                        tenant_id=test_tenant.id,
                        alert_type="info",
                        title="Welcome",
                        description="Your account is ready. Use the search to start monitoring companies.",
                        severity="low",
                        is_read=False
                    )
                ]
                for a in demo_alerts:
                    db.session.add(a)

                db.session.commit()
                app.logger.info("Seed complete (first-time). Login with test@example.com / SecurePass123")
            else:
                app.logger.info("Seed complete (or already present). Login with test@example.com / SecurePass123")

        except Exception as e:
            app.logger.error(f"Error during database initialization: {str(e)}")
            db.session.rollback()
            raise e

    return app

# -----------------------------------------------------------------------------
# Dev entrypoint
# -----------------------------------------------------------------------------
if __name__ == "__main__":

    # -------------------------------------------------------------------------
    # Integrations API
    # -------------------------------------------------------------------------
    @app.route("/api/integrations", methods=["GET"])
    @jwt_required()
    @require_tenant()
    def list_integrations():
        records = IntegrationConfig.query.filter_by(tenant_id=g.tenant_id).order_by(IntegrationConfig.service).all()
        return jsonify({"items": [r.to_dict() for r in records]})

    @app.route("/api/integrations", methods=["POST"])
    @jwt_required()
    @require_tenant()
    def upsert_integration():
        data = request.get_json(silent=True) or {}
        service = (data.get("service") or "").strip().lower()
        if not service:
            return jsonify({"error": "service_required"}), 400
        cfg = data.get("config") or {}
        status = (data.get("status") or "connected").strip().lower()
        rec = IntegrationConfig.query.filter_by(tenant_id=g.tenant_id, service=service).first()
        now = datetime.utcnow()
        if rec:
            rec.config = cfg
            rec.status = status
            if status == "connected":
                rec.connected_at = now
            db.session.commit()
        else:
            rec = IntegrationConfig(
                tenant_id=g.tenant_id, service=service, status=status,
                config=cfg, connected_at=now if status == "connected" else None
            )
            db.session.add(rec)
            db.session.commit()
        return jsonify({"item": rec.to_dict()}), 201

    @app.route("/api/integrations/<service>", methods=["PATCH"])
    @jwt_required()
    @require_tenant()
    def update_integration(service):
        rec = IntegrationConfig.query.filter_by(tenant_id=g.tenant_id, service=service.lower()).first()
        if not rec:
            return jsonify({"error": "not_found"}), 404
        data = request.get_json(silent=True) or {}
        if "status" in data and isinstance(data["status"], str):
            rec.status = data["status"].lower()
            if rec.status == "connected" and not rec.connected_at:
                rec.connected_at = datetime.utcnow()
        if "config" in data:
            rec.config = data["config"] or {}
        db.session.commit()
        return jsonify({"item": rec.to_dict()})

    @app.route("/api/integrations/<service>", methods=["DELETE"])
    @jwt_required()
    @require_tenant()
    def delete_integration(service):
        rec = IntegrationConfig.query.filter_by(tenant_id=g.tenant_id, service=service.lower()).first()
        if not rec:
            return jsonify({"error": "not_found"}), 404
        db.session.delete(rec)
        db.session.commit()
        return jsonify({"ok": True})

    # -------------------------------------------------------------------------
    # Prospects API
    # -------------------------------------------------------------------------
    @app.route("/api/prospects", methods=["GET"])
    @jwt_required()
    @require_tenant()
    def list_prospects():
        q = Prospect.query.filter_by(tenant_id=g.tenant_id)
        status = request.args.get("status")
        if status:
            q = q.filter(Prospect.status == status)
        company_id = request.args.get("company_id")
        if company_id:
            try:
                q = q.filter(Prospect.company_id == uuid.UUID(company_id))
            except Exception:
                pass
        items = q.order_by(Prospect.created_at.desc()).limit(200).all()
        return jsonify({"items": [i.to_dict() for i in items]})

    @app.route("/api/prospects", methods=["POST"])
    @jwt_required()
    @require_tenant()
    def create_prospect():
        data = request.get_json(silent=True) or {}
        p = Prospect(
            tenant_id=g.tenant_id,
            company_id=uuid.UUID(data["company_id"]) if data.get("company_id") else None,
            owner_user_id=g.current_user.id,
            first_name=data.get("first_name"),
            last_name=data.get("last_name"),
            title=data.get("title"),
            email=data.get("email"),
            phone=data.get("phone"),
            linkedin_url=data.get("linkedin_url"),
            source=(data.get("source") or "manual"),
            status=(data.get("status") or "new"),
            tags=data.get("tags") or [],
            notes=data.get("notes"),
        )
        db.session.add(p)
        db.session.commit()
        return jsonify({"item": p.to_dict()}), 201

    @app.route("/api/prospects/<prospect_id>", methods=["GET"])
    @jwt_required()
    @require_tenant()
    def get_prospect(prospect_id):
        try:
            pid = uuid.UUID(prospect_id)
        except Exception:
            return jsonify({"error": "invalid_id"}), 400
        p = Prospect.query.filter_by(id=pid, tenant_id=g.tenant_id).first()
        if not p:
            return jsonify({"error": "not_found"}), 404
        return jsonify({"item": p.to_dict()})

    @app.route("/api/prospects/<prospect_id>", methods=["PATCH"])
    @jwt_required()
    @require_tenant()
    def update_prospect(prospect_id):
        try:
            pid = uuid.UUID(prospect_id)
        except Exception:
            return jsonify({"error": "invalid_id"}), 400
        p = Prospect.query.filter_by(id=pid, tenant_id=g.tenant_id).first()
        if not p:
            return jsonify({"error": "not_found"}), 404
        data = request.get_json(silent=True) or {}
        for field in ["first_name","last_name","title","email","phone","linkedin_url","source","status","notes"]:
            if field in data:
                setattr(p, field, data[field])
        if "tags" in data:
            p.tags = data["tags"] or []
        if "company_id" in data:
            try:
                p.company_id = uuid.UUID(data["company_id"]) if data["company_id"] else None
            except Exception:
                pass
        db.session.commit()
        return jsonify({"item": p.to_dict()})

    @app.route("/api/prospects/<prospect_id>", methods=["DELETE"])
    @jwt_required()
    @require_tenant()
    def delete_prospect(prospect_id):
        try:
            pid = uuid.UUID(prospect_id)
        except Exception:
            return jsonify({"error": "invalid_id"}), 400
        p = Prospect.query.filter_by(id=pid, tenant_id=g.tenant_id).first()
        if not p:
            return jsonify({"error": "not_found"}), 404
        # Soft delete
        p.status = "archived"
        db.session.commit()
        return jsonify({"ok": True})

    # -------------------------------------------------------------------------
    # Pipeline API
    # -------------------------------------------------------------------------
    @app.route("/api/pipeline/stages", methods=["GET"])
    @jwt_required()
    @require_tenant()
    def list_stages():
        items = PipelineStage.query.filter_by(tenant_id=g.tenant_id).order_by(PipelineStage.order_index.asc()).all()
        return jsonify({"items": [i.to_dict() for i in items]})

    @app.route("/api/pipeline/stages", methods=["POST"])
    @jwt_required()
    @require_tenant()
    def create_stage():
        data = request.get_json(silent=True) or {}
        name = (data.get("name") or "").strip()
        if not name:
            return jsonify({"error": "name_required"}), 400
        max_order = db.session.query(db.func.coalesce(db.func.max(PipelineStage.order_index), -1)).filter_by(
            tenant_id=g.tenant_id
        ).scalar()
        stage = PipelineStage(
            tenant_id=g.tenant_id,
            name=name,
            order_index=(max_order + 1),
            probability=int(data.get("probability") or 0),
        )
        db.session.add(stage)
        db.session.commit()
        return jsonify({"item": stage.to_dict()}), 201

    @app.route("/api/pipeline/stages/<stage_id>", methods=["PATCH"])
    @jwt_required()
    @require_tenant()
    def update_stage(stage_id):
        try:
            sid = uuid.UUID(stage_id)
        except Exception:
            return jsonify({"error": "invalid_id"}), 400
        st = PipelineStage.query.filter_by(id=sid, tenant_id=g.tenant_id).first()
        if not st:
            return jsonify({"error": "not_found"}), 404
        data = request.get_json(silent=True) or {}
        if "name" in data and data["name"]:
            st.name = data["name"]
        if "probability" in data:
            try:
                st.probability = int(data["probability"])
            except Exception:
                pass
        db.session.commit()
        return jsonify({"item": st.to_dict()})

    @app.route("/api/pipeline/stages/<stage_id>", methods=["DELETE"])
    @jwt_required()
    @require_tenant()
    def delete_stage(stage_id):
        try:
            sid = uuid.UUID(stage_id)
        except Exception:
            return jsonify({"error": "invalid_id"}), 400
        st = PipelineStage.query.filter_by(id=sid, tenant_id=g.tenant_id).first()
        if not st:
            return jsonify({"error": "not_found"}), 404
        in_use = Deal.query.filter_by(tenant_id=g.tenant_id, stage_id=sid).first()
        if in_use:
            return jsonify({"error": "stage_in_use"}), 400
        db.session.delete(st)
        db.session.commit()
        return jsonify({"ok": True})

    @app.route("/api/pipeline/deals", methods=["GET"])
    @jwt_required()
    @require_tenant()
    def list_deals():
        q = Deal.query.filter_by(tenant_id=g.tenant_id)
        stage_id = request.args.get("stage_id")
        if stage_id:
            try:
                q = q.filter(Deal.stage_id == uuid.UUID(stage_id))
            except Exception:
                pass
        status = request.args.get("status")
        if status:
            q = q.filter(Deal.status == status)
        items = q.order_by(Deal.updated_at.desc()).limit(200).all()
        return jsonify({"items": [d.to_dict() for d in items]})

    @app.route("/api/pipeline/deals", methods=["POST"])
    @jwt_required()
    @require_tenant()
    def create_deal():
        data = request.get_json(silent=True) or {}
        title = (data.get("title") or "").strip()
        if not title:
            return jsonify({"error": "title_required"}), 400
        deal = Deal(
            tenant_id=g.tenant_id,
            title=title,
            company_id=uuid.UUID(data["company_id"]) if data.get("company_id") else None,
            prospect_id=uuid.UUID(data["prospect_id"]) if data.get("prospect_id") else None,
            stage_id=uuid.UUID(data["stage_id"]) if data.get("stage_id") else None,
            value_amount=data.get("value_amount") or 0,
            currency=(data.get("currency") or "GBP")[:3],
            status=(data.get("status") or "open"),
            expected_close_date=datetime.strptime(data["expected_close_date"], "%Y-%m-%d").date()
            if data.get("expected_close_date") else None,
        )
        db.session.add(deal)
        db.session.commit()
        return jsonify({"item": deal.to_dict()}), 201

    @app.route("/api/pipeline/deals/<deal_id>", methods=["PATCH"])
    @jwt_required()
    @require_tenant()
    def update_deal(deal_id):
        try:
            did = uuid.UUID(deal_id)
        except Exception:
            return jsonify({"error": "invalid_id"}), 400
        d = Deal.query.filter_by(id=did, tenant_id=g.tenant_id).first()
        if not d:
            return jsonify({"error": "not_found"}), 404
        data = request.get_json(silent=True) or {}
        for field in ["title","status","currency"]:
            if field in data and data[field] is not None:
                setattr(d, field, data[field])
        if "value_amount" in data and data["value_amount"] is not None:
            d.value_amount = data["value_amount"]
        if "stage_id" in data:
            try:
                d.stage_id = uuid.UUID(data["stage_id"]) if data["stage_id"] else None
            except Exception:
                pass
        if "expected_close_date" in data:
            try:
                d.expected_close_date = datetime.strptime(data["expected_close_date"], "%Y-%m-%d").date() if data["expected_close_date"] else None
            except Exception:
                pass
        db.session.commit()
        return jsonify({"item": d.to_dict()})

    @app.route("/api/pipeline/deals/<deal_id>", methods=["DELETE"])
    @jwt_required()
    @require_tenant()
    def delete_deal(deal_id):
        try:
            did = uuid.UUID(deal_id)
        except Exception:
            return jsonify({"error": "invalid_id"}), 400
        d = Deal.query.filter_by(id=did, tenant_id=g.tenant_id).first()
        if not d:
            return jsonify({"error": "not_found"}), 404
        db.session.delete(d)
        db.session.commit()
        return jsonify({"ok": True})
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True)