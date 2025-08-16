import os
import uuid
import base64
import re
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
import json

# ----------------------------------------------------------------------
# Extensions
# ----------------------------------------------------------------------

db = SQLAlchemy()
jwt = JWTManager()
limiter = Limiter(key_func=get_remote_address, default_limits=["1000 per hour"])

# ----------------------------------------------------------------------
# Helpers
# ----------------------------------------------------------------------

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

# ----------------------------------------------------------------------
# App Factory
# ----------------------------------------------------------------------

def create_app():
    app = Flask(__name__)

    # ----------------------------------------------------------------------
    # Config
    # ----------------------------------------------------------------------
    
    # Use SQLite for testing (no PostgreSQL driver needed)
    app.config["SQLALCHEMY_DATABASE_URI"] = _env(
        "DATABASE_URL",
        "sqlite:///test_database.db"
    )
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

    # Small boot summary (nice for debugging in logs)
    app.logger.info(f"CORS origins: {cors_origins}")
    app.logger.info(f"Rate limit storage: {app.config.get('RATELIMIT_STORAGE_URI')}")

    # ----------------------------------------------------------------------
    # Models (SQLite Compatible)
    # ----------------------------------------------------------------------

    class Tenant(db.Model):
        __tablename__ = "tenants"

        id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
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

        id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
        email = db.Column(db.String(255), unique=True, nullable=False)
        password_hash = db.Column(db.String(255), nullable=False)
        first_name = db.Column(db.String(100))
        last_name = db.Column(db.String(100))
        tenant_id = db.Column(db.String(36), db.ForeignKey("tenants.id"), nullable=False)
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
        SQLite-compatible version - using JSON instead of ARRAY for sic_codes
        """
        __tablename__ = "companies"

        id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
        tenant_id = db.Column(db.String(36), db.ForeignKey("tenants.id"), nullable=False)

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
        sic_codes_json = db.Column(db.Text)  # Store as JSON string
        is_monitored = db.Column(db.Boolean, default=False)

        # Timestamps
        created_at = db.Column(db.DateTime, default=datetime.utcnow)
        updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

        __table_args__ = (
            db.UniqueConstraint("tenant_id", "company_number", name="companies_tenant_id_company_number_key"),
        )

        @property
        def sic_codes(self):
            """Get SIC codes as a list"""
            if self.sic_codes_json:
                try:
                    return json.loads(self.sic_codes_json)
                except:
                    return []
            return []

        @sic_codes.setter
        def sic_codes(self, value):
            """Set SIC codes from a list"""
            if value:
                self.sic_codes_json = json.dumps(value)
            else:
                self.sic_codes_json = None

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

        id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
        tenant_id = db.Column(db.String(36), db.ForeignKey("tenants.id"), nullable=False)
        company_id = db.Column(db.String(36), db.ForeignKey("companies.id"))  # nullable OK
        alert_type = db.Column(db.String(100), nullable=False)
        title = db.Column(db.String(255), nullable=False)
        description = db.Column(db.Text)
        severity = db.Column(db.String(20), default="medium")
        is_read = db.Column(db.Boolean, default=False)
        created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # ----------------------------------------------------------------------
    # Multi-tenant guard
    # ----------------------------------------------------------------------

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
                    lookup_id = str(user_id)  # Convert to string for SQLite
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

    # ----------------------------------------------------------------------
    # Companies House helpers
    # ----------------------------------------------------------------------

    def _ch_headers():
        key = app.config.get("COMPANIES_HOUSE_API_KEY", "")
        if not key:
            return None

        # Basic auth with key as username, blank password
        auth = base64.b64encode(f"{key}:".encode("ascii")).decode("ascii")
        return {"Authorization": f"Basic {auth}"}

    def search_companies_house(query, max_results=20):
        """
        https://developer.company-information.service.gov.uk/advanced-search/companies
        This hits: /search/companies?q=
        Returns items with fields:
        - company_number
        - title (company_name)
        - company_status
        - address_snippet or address object
        - date_of_creation
        """
        headers = _ch_headers()
        if headers is None:
            # keep service "online", but tell caller it's not configured
            app.logger.warning("Companies House API key missing; search disabled.")
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
        Common keys:
        - company_name (string)
        - company_number (string)
        - company_status (string)
        - date_of_creation (YYYY-MM-DD)
        - registered_office_address { address_line_1, address_line_2, locality, postal_code, country }
        - sic_codes: list[str] <-- IMPORTANT: strings, not objects
        """
        headers = _ch_headers()
        if headers is None:
            app.logger.warning("Companies House API key missing; details disabled.")
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

    # ----------------------------------------------------------------------
    # Routes
    # ----------------------------------------------------------------------

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
            # Companies House response keys:
            # - company_number
            # - title (=> name)
            # - company_status
            # - address: sometimes present (address_line_1, locality, postal_code, etc)
            ch_number = item.get("company_number")
            title = item.get("title")
            status = item.get("company_status")
            addr = (item.get("address") or {}) if isinstance(item.get("address"), dict) else {}

            # cross-check if already monitored for this tenant
            existing = None
            if ch_number:
                existing = Company.query.filter_by(
                    tenant_id=g.tenant_id, company_number=ch_number
                ).first()

            companies.append({
                "companies_house_number": ch_number,  # keep this name for frontend consistency
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
        # local state
        company = Company.query.filter_by(
            tenant_id=g.tenant_id, company_number=company_number
        ).first()

        ch = get_company_details(company_number)
        if ch is None:
            return jsonify({"error": "Company not found"}), 404

        if isinstance(ch, dict) and ch.get("error") == "api_key_missing":
            return jsonify({"error": "Companies House API key missing"}), 503

        # NOTE: sic_codes are STRINGS in CH API
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
            "filing_history": ch.get("filing_history", {}),  # sometimes not in this endpoint
            "is_monitored": company is not None,
            "monitoring_since": company.created_at.isoformat() if company else None
        }

        return jsonify({"company": info})

    @app.route("/api/companies/<company_number>/monitor", methods=["POST"])
    @jwt_required()
    @require_tenant()
    def add_to_monitoring(company_number):
        # already monitored?
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

        # parse CH details
        ro = ch.get("registered_office_address") or {}

        # CH sic_codes are list[str]
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
            is_monitored=True
        )
        company.sic_codes = sic_codes  # Use the property setter

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

    # ----------------------------------------------------------------------
    # DB init & seed (idempotent)
    # ----------------------------------------------------------------------

    with app.app_context():
        try:
            db.create_all()
            app.logger.info("Database tables created successfully")

            test_tenant = Tenant.query.filter_by(name="Demo Organization").first()
            if not test_tenant:
                # Seed (only first run)
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

                # NOTE: Do not pre-insert companies anymore --- let API be the source of truth.
                # But we can create a couple of demo alerts to show the dashboard.
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

# ----------------------------------------------------------------------
# Dev entrypoint
# ----------------------------------------------------------------------

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True)