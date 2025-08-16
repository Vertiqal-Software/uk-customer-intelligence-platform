-- database/migrations/003_auth_tables.sql
-- Authentication and user management tables

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT TRUE,
    slack_notifications BOOLEAN DEFAULT FALSE,
    teams_notifications BOOLEAN DEFAULT FALSE,
    alert_frequency VARCHAR(20) DEFAULT 'immediate', -- immediate, hourly, daily
    dashboard_layout JSONB DEFAULT '{}',
    theme VARCHAR(20) DEFAULT 'light',
    timezone VARCHAR(50) DEFAULT 'Europe/London',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Audit logs for compliance and security
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(255),
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_audit_tenant (tenant_id),
    INDEX idx_audit_user (user_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_created (created_at DESC)
);

-- API keys for programmatic access
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id),
    user_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    permissions JSONB DEFAULT '[]',
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_api_keys_tenant (tenant_id),
    INDEX idx_api_keys_active (is_active),
    UNIQUE(key_hash)
);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_reset_tokens_user (user_id),
    INDEX idx_reset_tokens_token (token_hash)
);

-- Email verification tokens
CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_verification_user (user_id),
    INDEX idx_verification_token (token_hash)
);

-- Session management (optional - for server-side sessions)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id),
    session_token VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_sessions_user (user_id),
    INDEX idx_sessions_token (session_token),
    INDEX idx_sessions_expires (expires_at)
);

-- Team invitations
CREATE TABLE IF NOT EXISTS team_invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id),
    invited_by UUID NOT NULL REFERENCES users(id),
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'member',
    token_hash VARCHAR(255) NOT NULL,
    accepted_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_invitations_tenant (tenant_id),
    INDEX idx_invitations_email (email),
    INDEX idx_invitations_token (token_hash)
);

-- Update users table with additional auth fields if not exists
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS two_factor_secret VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE;

-- Update tenants table with subscription fields
ALTER TABLE tenants
ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(50) DEFAULT 'trial',
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS max_users INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS max_companies INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS billing_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '14 days';

-- Function to check if user is locked
CREATE OR REPLACE FUNCTION is_user_locked(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    locked_until TIMESTAMP WITH TIME ZONE;
BEGIN
    SELECT u.locked_until INTO locked_until
    FROM users u
    WHERE u.id = user_id;
    
    IF locked_until IS NULL THEN
        RETURN FALSE;
    END IF;
    
    RETURN locked_until > NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to increment failed login attempts
CREATE OR REPLACE FUNCTION increment_failed_login(user_email VARCHAR)
RETURNS VOID AS $$
BEGIN
    UPDATE users 
    SET 
        failed_login_attempts = failed_login_attempts + 1,
        locked_until = CASE 
            WHEN failed_login_attempts >= 4 THEN NOW() + INTERVAL '30 minutes'
            ELSE locked_until
        END
    WHERE email = user_email;
END;
$$ LANGUAGE plpgsql;

-- Function to reset failed login attempts
CREATE OR REPLACE FUNCTION reset_failed_login(user_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE users 
    SET 
        failed_login_attempts = 0,
        locked_until = NULL
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- View for active users with tenant info
CREATE OR REPLACE VIEW active_users_with_tenant AS
SELECT 
    u.id,
    u.email,
    u.full_name,
    u.role,
    u.created_at,
    u.last_login,
    t.id as tenant_id,
    t.name as tenant_name,
    t.subscription_tier,
    t.is_active as tenant_active
FROM users u
JOIN tenants t ON u.tenant_id = t.id
WHERE u.is_active = TRUE
    AND t.is_active = TRUE
    AND (u.locked_until IS NULL OR u.locked_until < NOW());

-- View for login audit trail
CREATE OR REPLACE VIEW login_audit_trail AS
SELECT 
    al.created_at,
    al.action,
    al.ip_address,
    al.user_agent,
    u.email,
    u.full_name,
    t.name as tenant_name
FROM audit_logs al
LEFT JOIN users u ON al.user_id = u.id
LEFT JOIN tenants t ON al.tenant_id = t.id
WHERE al.action IN ('login_success', 'login_failed', 'logout', 'password_changed')
ORDER BY al.created_at DESC;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_tenants_active ON tenants(is_active);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();