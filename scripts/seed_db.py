#!/usr/bin/env python3
"""
Seed database with initial test data for UK Customer Intelligence Platform.
Run this script to create test tenant and user for development.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app import create_app
from backend.models.user import db, User, Tenant, Company, Alert
from datetime import datetime, timedelta
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_database():
    """Seed database with initial test data."""
    app = create_app()
    with app.app_context():
        try:
            # Check if test user already exists
            existing_user = User.query.filter_by(email='test@example.com').first()
            if existing_user:
                logger.info("Test user already exists, skipping seed")
                return
            
            logger.info("Creating test tenant...")
            # Create test tenant
            tenant = Tenant(
                name='Test Company Ltd',
                slug='test-company',
                subscription_plan='professional',
                settings={
                    'notifications_enabled': True,
                    'monitoring_frequency': 'daily'
                }
            )
            db.session.add(tenant)
            db.session.flush()
            
            logger.info("Creating test user...")
            # Create test user with password 'SecurePass123'
            user = User(
                tenant_id=tenant.id,
                email='test@example.com',
                first_name='Test',
                last_name='User',
                role='admin'
            )
            user.set_password('SecurePass123')
            db.session.add(user)
            db.session.flush()
            
            logger.info("Creating sample companies...")
            # Create some sample companies
            companies_data = [
                {
                    'company_number': '00445790',
                    'company_name': 'TESCO PLC',
                    'company_status': 'active',
                    'company_type': 'plc',
                    'incorporation_date': datetime(1919, 11, 27).date(),
                    'is_monitored': True
                },
                {
                    'company_number': '04270505',
                    'company_name': 'ASOS PLC',
                    'company_status': 'active',
                    'company_type': 'plc',
                    'incorporation_date': datetime(2000, 6, 2).date(),
                    'is_monitored': True
                },
                {
                    'company_number': '03584121',
                    'company_name': 'DELIVEROO PLC',
                    'company_status': 'active',
                    'company_type': 'plc',
                    'incorporation_date': datetime(2013, 2, 1).date(),
                    'is_monitored': False
                }
            ]
            
            for company_data in companies_data:
                company = Company(
                    tenant_id=tenant.id,
                    **company_data,
                    sic_codes=['47110'],
                    registered_office_address={
                        'address_line_1': 'Tesco House',
                        'locality': 'Welwyn Garden City',
                        'postal_code': 'AL7 1GA',
                        'country': 'United Kingdom'
                    },
                    last_fetched_at=datetime.utcnow()
                )
                db.session.add(company)
                db.session.flush()
                
                # Create sample alert for monitored companies
                if company_data['is_monitored']:
                    alert = Alert(
                        tenant_id=tenant.id,
                        company_id=company.id,
                        alert_type='filing_update',
                        severity='medium',
                        title=f'New filing for {company_data["company_name"]}',
                        description=f'Annual accounts have been filed for {company_data["company_name"]}',
                        data={'filing_type': 'AA', 'filing_date': datetime.utcnow().isoformat()},
                        is_read=False
                    )
                    db.session.add(alert)
            
            db.session.commit()
            logger.info("Database seeded successfully!")
            logger.info("Test credentials:")
            logger.info("  Email: test@example.com")
            logger.info("  Password: SecurePass123")
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error seeding database: {e}")
            raise

if __name__ == '__main__':
    seed_database()