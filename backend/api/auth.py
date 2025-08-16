from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    jwt_required, create_access_token, create_refresh_token,
    get_jwt_identity, get_jwt, verify_jwt_in_request
)
from werkzeug.security import generate_password_hash
from datetime import timedelta, datetime
import re
from backend.models.user import db, User, Tenant, Company

# Create the authentication blueprint
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# Email validation regex
EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')

def validate_email(email):
    """Validate email format."""
    return EMAIL_REGEX.match(email) is not None

def validate_password(password):
    """Validate password strength."""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    
    return True, "Password is valid"

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user."""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Extract required fields
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    first_name = data.get('first_name', '').strip()
    last_name = data.get('last_name', '').strip()
    company_name = data.get('company_name', '').strip()
    
    # Validation
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    if not validate_email(email):
        return jsonify({'error': 'Invalid email format'}), 400
    
    if not password:
        return jsonify({'error': 'Password is required'}), 400
    
    is_valid, message = validate_password(password)
    if not is_valid:
        return jsonify({'error': message}), 400
    
    if not first_name:
        return jsonify({'error': 'First name is required'}), 400
    
    if not company_name:
        return jsonify({'error': 'Company name is required'}), 400
    
    # Check if user already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'error': 'User with this email already exists'}), 409
    
    try:
        # Create tenant (organization) first
        tenant_slug = re.sub(r'[^a-zA-Z0-9-]', '-', company_name.lower())
        tenant_slug = re.sub(r'-+', '-', tenant_slug).strip('-')
        
        # Ensure unique slug
        counter = 1
        original_slug = tenant_slug
        while Tenant.query.filter_by(slug=tenant_slug).first():
            tenant_slug = f"{original_slug}-{counter}"
            counter += 1
        
        tenant = Tenant(
            name=company_name,
            slug=tenant_slug,
            subscription_plan='free'
        )
        db.session.add(tenant)
        db.session.flush()  # Get the tenant ID
        
        # Create user
        user = User.create_user(
            email=email,
            password=password,
            tenant_id=tenant.id,
            first_name=first_name,
            last_name=last_name,
            role='admin'  # First user in tenant becomes admin
        )
        
        # Generate tokens
        access_token = create_access_token(
            identity=user.id,
            expires_delta=timedelta(hours=24)
        )
        refresh_token = create_refresh_token(
            identity=user.id,
            expires_delta=timedelta(days=30)
        )
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user.to_dict(),
            'tenant': tenant.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Registration error: {str(e)}")
        return jsonify({'error': 'Registration failed'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Authenticate user and return tokens."""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    
    # Authenticate user
    user = User.authenticate(email, password)
    
    if not user:
        return jsonify({'error': 'Invalid email or password'}), 401
    
    if not user.is_active:
        return jsonify({'error': 'Account is disabled'}), 401
    
    try:
        # Generate tokens
        access_token = create_access_token(
            identity=user.id,
            expires_delta=timedelta(hours=24)
        )
        refresh_token = create_refresh_token(
            identity=user.id,
            expires_delta=timedelta(days=30)
        )
        
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict(include_sensitive=True),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Login error: {str(e)}")
        return jsonify({'error': 'Login failed'}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token using refresh token."""
    current_user_id = get_jwt_identity()
    
    # Get current user
    user = User.query.get(current_user_id)
    if not user or not user.is_active:
        return jsonify({'error': 'User not found or inactive'}), 404
    
    # Generate new access token
    new_access_token = create_access_token(
        identity=user.id,
        expires_delta=timedelta(hours=24)
    )
    
    return jsonify({
        'access_token': new_access_token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user information."""
    current_user_id = get_jwt_identity()
    
    user = User.query.get(current_user_id)
    if not user or not user.is_active:
        return jsonify({'error': 'User not found or inactive'}), 404
    
    return jsonify({
        'user': user.to_dict(include_sensitive=True)
    }), 200

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user (client-side token removal)."""
    # In a production app, you might want to maintain a blacklist of tokens
    # For now, we'll just return success and let the client remove the token
    return jsonify({'message': 'Logout successful'}), 200

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password."""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    current_password = data.get('current_password', '')
    new_password = data.get('new_password', '')
    
    if not current_password or not new_password:
        return jsonify({'error': 'Current password and new password are required'}), 400
    
    # Get current user
    user = User.query.get(current_user_id)
    if not user or not user.is_active:
        return jsonify({'error': 'User not found or inactive'}), 404
    
    # Verify current password
    if not user.check_password(current_password):
        return jsonify({'error': 'Current password is incorrect'}), 401
    
    # Validate new password
    is_valid, message = validate_password(new_password)
    if not is_valid:
        return jsonify({'error': message}), 400
    
    try:
        # Update password
        user.set_password(new_password)
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'message': 'Password changed successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Password change error: {str(e)}")
        return jsonify({'error': 'Password change failed'}), 500

@auth_bp.route('/update-profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile information."""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Get current user
    user = User.query.get(current_user_id)
    if not user or not user.is_active:
        return jsonify({'error': 'User not found or inactive'}), 404
    
    try:
        # Update allowed fields
        if 'first_name' in data:
            user.first_name = data['first_name'].strip()
        
        if 'last_name' in data:
            user.last_name = data['last_name'].strip()
        
        if 'preferences' in data and isinstance(data['preferences'], dict):
            user.preferences = {**user.preferences, **data['preferences']}
        
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Profile update error: {str(e)}")
        return jsonify({'error': 'Profile update failed'}), 500

# Company monitoring endpoints
@auth_bp.route('/companies/watched', methods=['GET'])
@jwt_required()
def get_watched_companies():
    """Get user's watched companies."""
    current_user_id = get_jwt_identity()
    
    user = User.query.get(current_user_id)
    if not user or not user.is_active:
        return jsonify({'error': 'User not found or inactive'}), 404
    
    # Get watched companies for the user's tenant
    companies = Company.query.filter_by(
        tenant_id=user.tenant_id,
        is_monitored=True
    ).order_by(Company.updated_at.desc()).all()
    
    return jsonify({
        'companies': [company.to_dict() for company in companies],
        'total_count': len(companies)
    }), 200

@auth_bp.route('/companies/watch', methods=['POST'])
@jwt_required()
def add_company_to_watchlist():
    """Add a company to the user's watchlist."""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    company_number = data.get('company_number', '').strip().upper()
    
    if not company_number:
        return jsonify({'error': 'Company number is required'}), 400
    
    user = User.query.get(current_user_id)
    if not user or not user.is_active:
        return jsonify({'error': 'User not found or inactive'}), 404
    
    try:
        # Check if company already exists in watchlist
        existing_company = Company.query.filter_by(
            tenant_id=user.tenant_id,
            company_number=company_number
        ).first()
        
        if existing_company:
            if existing_company.is_monitored:
                return jsonify({'message': 'Company is already in watchlist'}), 200
            else:
                # Reactivate monitoring
                existing_company.is_monitored = True
                existing_company.updated_at = datetime.utcnow()
                db.session.commit()
                return jsonify({
                    'message': 'Company added to watchlist',
                    'company': existing_company.to_dict()
                }), 200
        
        # Fetch company data from Companies House
        from backend.data_sources.companies_house import get_company_data
        company_data = get_company_data(company_number)
        
        if not company_data:
            return jsonify({'error': 'Company not found'}), 404
        
        # Create new company record
        company = Company(
            tenant_id=user.tenant_id,
            company_number=company_data['company_number'],
            company_name=company_data['company_name'],
            company_status=company_data['company_status'],
            company_type=company_data['company_type'],
            incorporation_date=datetime.fromisoformat(company_data['incorporation_date']) if company_data.get('incorporation_date') else None,
            jurisdiction=company_data.get('jurisdiction'),
            sic_codes=company_data.get('sic_codes'),
            registered_office_address=company_data.get('registered_office_address'),
            accounts=company_data.get('accounts'),
            confirmation_statement=company_data.get('confirmation_statement'),
            is_monitored=True,
            risk_score=company_data.get('risk_indicators', {}).get('risk_score', 0),
            risk_indicators=company_data.get('risk_indicators'),
            raw_data=company_data.get('raw_data'),
            last_fetched_at=datetime.utcnow()
        )
        
        db.session.add(company)
        db.session.commit()
        
        return jsonify({
            'message': 'Company added to watchlist successfully',
            'company': company.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Add to watchlist error: {str(e)}")
        return jsonify({'error': 'Failed to add company to watchlist'}), 500

@auth_bp.route('/companies/unwatch/<company_id>', methods=['DELETE'])
@jwt_required()
def remove_company_from_watchlist(company_id):
    """Remove a company from the user's watchlist."""
    current_user_id = get_jwt_identity()
    
    user = User.query.get(current_user_id)
    if not user or not user.is_active:
        return jsonify({'error': 'User not found or inactive'}), 404
    
    # Find the company
    company = Company.query.filter_by(
        id=company_id,
        tenant_id=user.tenant_id
    ).first()
    
    if not company:
        return jsonify({'error': 'Company not found in your watchlist'}), 404
    
    try:
        # Stop monitoring (don't delete, just set is_monitored to False)
        company.is_monitored = False
        company.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'message': 'Company removed from watchlist'}), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Remove from watchlist error: {str(e)}")
        return jsonify({'error': 'Failed to remove company from watchlist'}), 500

# Error handlers
@auth_bp.errorhandler(422)
def handle_unprocessable_entity(e):
    """Handle JWT decode errors."""
    return jsonify({'error': 'Invalid token'}), 422

@auth_bp.errorhandler(401)
def handle_unauthorized(e):
    """Handle unauthorized access."""
    return jsonify({'error': 'Unauthorized access'}), 401