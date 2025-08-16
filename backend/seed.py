# seed.py
from sqlalchemy.dialects.postgresql import insert
from backend.models import User, Company, Tenant, db

def upsert_user(email, **fields):
    stmt = insert(User).values(email=email, **fields)\
        .on_conflict_do_nothing(index_elements=["email"])
    db.session.execute(stmt)

def upsert_company(tenant_id, company_number, **fields):
    # choose your unique key: (tenant_id, company_number) or just company_number
    stmt = insert(Company).values(tenant_id=tenant_id, company_number=company_number, **fields)\
        .on_conflict_do_update(
            index_elements=["tenant_id", "company_number"],
            set_=fields
        )
    db.session.execute(stmt)

def seed_initial_data(db):
    # create/ensure tenant
    # upsert tenant similarly (by name or slug)
    # upsert a test user
    upsert_user("test@example.com",
                password_hash="...", first_name="Test", last_name="User",
                tenant_id=tenant_id, is_active=True)
    # upsert a few companies
    upsert_company(tenant_id, "09542757",
                   company_name="MARKS AND SPENCER GROUP PLC",
                   company_status="active",
                   incorporation_date=date(1884, 9, 15),
                   address_line_1="WATERSIDE HOUSE",
                   address_line_2="35 NORTH WHARF ROAD",
                   locality="LONDON", postal_code="W2 1NW",
                   country="United Kingdom",
                   sic_codes=["Retail sale in non-specialised stores with food predominating"],
                   is_monitored=True)
    db.session.commit()
