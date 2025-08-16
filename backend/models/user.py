from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import uuid

db = SQLAlchemy()

class Tenant(db.Model):
    """Multi-tenant organization model."""
    __tablename__ = 'tenants'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    subscription_plan = db.Column(db.String(50), default='free')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    settings = db.Column(db.JSON, default=dict)
    
    # Relationships
    users = db.relationship('User', backref='tenant', lazy=True, cascade='all, delete-orphan')
    companies = db.relationship('Company', backref='tenant', lazy=True, cascade='all, delete-orphan')
    alerts = db.relationship('Alert', backref='tenant', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Tenant {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'subscription_plan': self.subscription_plan,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'settings': self.settings
        }

class User(db.Model):
    """User model with authentication and authorization."""
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id = db.Column(db.String(36), db.ForeignKey('tenants.id'), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    role = db.Column(db.String(50), default='user')  # user, admin, super_admin
    is_active = db.Column(db.Boolean, default=True)
    last_login = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    preferences = db.Column(db.JSON, default=dict)
    
    def __repr__(self):
        return f'<User {self.email}>'
    
    def set_password(self, password):
        """Hash and set the user's password."""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if the provided password matches the user's password."""
        return check_password_hash(self.password_hash, password)
    
    def update_last_login(self):
        """Update the user's last login timestamp."""
        self.last_login = datetime.utcnow()
        db.session.commit()
    
    @property
    def full_name(self):
        """Get the user's full name."""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        elif self.first_name:
            return self.first_name
        elif self.last_name:
            return self.last_name
        else:
            return self.email.split('@')[0]
    
    def to_dict(self, include_sensitive=False):
        """Convert user to dictionary, optionally including sensitive data."""
        data = {
            'id': self.id,
            'tenant_id': self.tenant_id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': self.full_name,
            'role': self.role,
            'is_active': self.is_active,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'preferences': self.preferences
        }
        
        if include_sensitive:
            data['tenant'] = self.tenant.to_dict() if self.tenant else None
            
        return data
    
    def has_permission(self, permission):
        """Check if user has a specific permission."""
        role_permissions = {
            'user': ['read_companies', 'manage_own_alerts'],
            'admin': ['read_companies', 'manage_all_alerts', 'manage_users', 'manage_tenant'],
            'super_admin': ['*']  # All permissions
        }
        
        user_permissions = role_permissions.get(self.role, [])
        return '*' in user_permissions or permission in user_permissions
    
    @staticmethod
    def create_user(email, password, tenant_id, first_name=None, last_name=None, role='user'):
        """Create a new user."""
        user = User(
            email=email.lower().strip(),
            tenant_id=tenant_id,
            first_name=first_name,
            last_name=last_name,
            role=role
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        return user
    
    @staticmethod
    def authenticate(email, password):
        """Authenticate a user with email and password."""
        user = User.query.filter_by(email=email.lower().strip(), is_active=True).first()
        
        if user and user.check_password(password):
            user.update_last_login()
            return user
        
        return None

class Company(db.Model):
    """Company model for storing monitored companies."""
    __tablename__ = 'companies'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id = db.Column(db.String(36), db.ForeignKey('tenants.id'), nullable=False)
    company_number = db.Column(db.String(20), nullable=False)
    company_name = db.Column(db.String(255), nullable=False)
    company_status = db.Column(db.String(50))
    company_type = db.Column(db.String(100))
    incorporation_date = db.Column(db.Date)
    dissolution_date = db.Column(db.Date)
    jurisdiction = db.Column(db.String(50))
    sic_codes = db.Column(db.JSON)
    registered_office_address = db.Column(db.JSON)
    accounts = db.Column(db.JSON)
    confirmation_statement = db.Column(db.JSON)
    is_active = db.Column(db.Boolean, default=True)
    is_monitored = db.Column(db.Boolean, default=False)
    risk_score = db.Column(db.Integer, default=0)
    risk_indicators = db.Column(db.JSON, default=dict)
    raw_data = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_fetched_at = db.Column(db.DateTime)
    
    # Relationships
    alerts = db.relationship('Alert', backref='company', lazy=True, cascade='all, delete-orphan')
    
    # Unique constraint per tenant
    __table_args__ = (db.UniqueConstraint('tenant_id', 'company_number', name='_tenant_company_uc'),)
    
    def __repr__(self):
        return f'<Company {self.company_name} ({self.company_number})>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'tenant_id': self.tenant_id,
            'company_number': self.company_number,
            'company_name': self.company_name,
            'company_status': self.company_status,
            'company_type': self.company_type,
            'incorporation_date': self.incorporation_date.isoformat() if self.incorporation_date else None,
            'dissolution_date': self.dissolution_date.isoformat() if self.dissolution_date else None,
            'jurisdiction': self.jurisdiction,
            'sic_codes': self.sic_codes,
            'registered_office_address': self.registered_office_address,
            'accounts': self.accounts,
            'confirmation_statement': self.confirmation_statement,
            'is_active': self.is_active,
            'is_monitored': self.is_monitored,
            'risk_score': self.risk_score,
            'risk_indicators': self.risk_indicators,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'last_fetched_at': self.last_fetched_at.isoformat() if self.last_fetched_at else None
        }

class Alert(db.Model):
    """Alert model for company notifications."""
    __tablename__ = 'alerts'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id = db.Column(db.String(36), db.ForeignKey('tenants.id'), nullable=False)
    company_id = db.Column(db.String(36), db.ForeignKey('companies.id'), nullable=False)
    alert_type = db.Column(db.String(100), nullable=False)
    severity = db.Column(db.String(20), default='medium')  # low, medium, high, critical
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    data = db.Column(db.JSON)
    is_read = db.Column(db.Boolean, default=False)
    is_dismissed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime)
    
    def __repr__(self):
        return f'<Alert {self.title}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'tenant_id': self.tenant_id,
            'company_id': self.company_id,
            'alert_type': self.alert_type,
            'severity': self.severity,
            'title': self.title,
            'description': self.description,
            'data': self.data,
            'is_read': self.is_read,
            'is_dismissed': self.is_dismissed,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None
        }