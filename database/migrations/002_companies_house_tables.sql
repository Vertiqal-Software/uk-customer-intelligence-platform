-- database/migrations/002_companies_house_tables.sql
-- Additional tables for Companies House integration

-- Company filings table (accounts, confirmation statements, etc.)
CREATE TABLE IF NOT EXISTS company_filings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id),
    transaction_id VARCHAR(50),
    category VARCHAR(50), -- accounts, confirmation-statement, incorporation, etc.
    type VARCHAR(100),
    date DATE,
    description TEXT,
    paper_filed BOOLEAN DEFAULT FALSE,
    raw_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(company_id, transaction_id),
    INDEX idx_filings_company (company_id),
    INDEX idx_filings_date (date DESC),
    INDEX idx_filings_category (category)
);

-- Company officers (directors, secretaries)
CREATE TABLE IF NOT EXISTS company_officers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id),
    officer_id VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50), -- director, secretary, etc.
    appointed_on DATE,
    resigned_on DATE,
    is_active BOOLEAN DEFAULT TRUE,
    nationality VARCHAR(100),
    date_of_birth VARCHAR(10), -- month/year only for privacy
    country_of_residence VARCHAR(100),
    occupation VARCHAR(255),
    address JSONB,
    raw_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_officers_company (company_id),
    INDEX idx_officers_active (is_active),
    INDEX idx_officers_name (name)
);

-- Company charges (mortgages, debentures)
CREATE TABLE IF NOT EXISTS company_charges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id),
    charge_number VARCHAR(50),
    charge_code VARCHAR(50),
    status VARCHAR(50), -- outstanding, satisfied, part-satisfied
    classification JSONB,
    created_on DATE,
    delivered_on DATE,
    satisfied_on DATE,
    persons_entitled JSONB,
    particulars TEXT,
    raw_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(company_id, charge_number),
    INDEX idx_charges_company (company_id),
    INDEX idx_charges_status (status)
);

-- Persons with significant control
CREATE TABLE IF NOT EXISTS company_pscs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id),
    psc_id VARCHAR(100),
    name VARCHAR(255),
    kind VARCHAR(50), -- individual, corporate-entity, legal-person
    address JSONB,
    nationality VARCHAR(100),
    country_of_residence VARCHAR(100),
    notified_on DATE,
    ceased_on DATE,
    is_active BOOLEAN DEFAULT TRUE,
    nature_of_control JSONB,
    raw_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_pscs_company (company_id),
    INDEX idx_pscs_active (is_active)
);

-- Company monitoring configuration
CREATE TABLE IF NOT EXISTS company_monitoring_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id),
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high
    check_frequency_hours INTEGER DEFAULT 24,
    monitor_filings BOOLEAN DEFAULT TRUE,
    monitor_officers BOOLEAN DEFAULT TRUE,
    monitor_charges BOOLEAN DEFAULT TRUE,
    monitor_pscs BOOLEAN DEFAULT TRUE,
    alert_on_status_change BOOLEAN DEFAULT TRUE,
    alert_on_new_filing BOOLEAN DEFAULT TRUE,
    alert_on_officer_change BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(company_id),
    INDEX idx_monitoring_priority (priority, is_active)
);

-- Company change logs for audit trail
CREATE TABLE IF NOT EXISTS company_change_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id),
    change_type VARCHAR(50), -- status_change, new_filing, officer_change, etc.
    change_data JSONB,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    alert_generated BOOLEAN DEFAULT FALSE,
    
    INDEX idx_change_logs_company (company_id),
    INDEX idx_change_logs_detected (detected_at DESC)
);

-- Add Companies House specific columns to companies table
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS last_companies_house_check TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS companies_house_etag VARCHAR(255),
ADD COLUMN IF NOT EXISTS is_monitored BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS monitoring_notes TEXT;

-- Add indexes for Companies House monitoring
CREATE INDEX IF NOT EXISTS idx_companies_monitoring 
ON companies(tenant_id, is_monitored, last_companies_house_check);

CREATE INDEX IF NOT EXISTS idx_companies_number 
ON companies(company_number);

-- Function to check if company data is stale
CREATE OR REPLACE FUNCTION is_company_data_stale(last_check TIMESTAMP WITH TIME ZONE, priority VARCHAR DEFAULT 'medium')
RETURNS BOOLEAN AS $$
BEGIN
    IF last_check IS NULL THEN
        RETURN TRUE;
    END IF;
    
    RETURN CASE priority
        WHEN 'high' THEN last_check < NOW() - INTERVAL '1 hour'
        WHEN 'medium' THEN last_check < NOW() - INTERVAL '1 day'
        WHEN 'low' THEN last_check < NOW() - INTERVAL '7 days'
        ELSE last_check < NOW() - INTERVAL '1 day'
    END;
END;
$$ LANGUAGE plpgsql;

-- View for companies requiring update
CREATE OR REPLACE VIEW companies_requiring_update AS
SELECT 
    c.id,
    c.company_number,
    c.company_name,
    c.tenant_id,
    c.last_companies_house_check,
    COALESCE(cfg.priority, 'medium') as priority,
    is_company_data_stale(c.last_companies_house_check, COALESCE(cfg.priority, 'medium')) as needs_update
FROM companies c
LEFT JOIN company_monitoring_config cfg ON c.id = cfg.company_id
WHERE c.is_monitored = TRUE
    AND COALESCE(cfg.is_active, TRUE) = TRUE
    AND is_company_data_stale(c.last_companies_house_check, COALESCE(cfg.priority, 'medium')) = TRUE;

-- View for recent company changes
CREATE OR REPLACE VIEW recent_company_changes AS
SELECT 
    c.company_name,
    c.company_number,
    cl.change_type,
    cl.change_data,
    cl.detected_at,
    cl.tenant_id
FROM company_change_logs cl
JOIN companies c ON cl.company_id = c.id
WHERE cl.detected_at > NOW() - INTERVAL '7 days'
ORDER BY cl.detected_at DESC;

-- Trigger to update last_updated timestamp
CREATE OR REPLACE FUNCTION update_companies_house_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_company_officers_timestamp
    BEFORE UPDATE ON company_officers
    FOR EACH ROW
    EXECUTE FUNCTION update_companies_house_timestamp();

CREATE TRIGGER update_company_pscs_timestamp
    BEFORE UPDATE ON company_pscs
    FOR EACH ROW
    EXECUTE FUNCTION update_companies_house_timestamp();