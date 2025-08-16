# models/company.py
class Company(db.Model):
    __tablename__ = "companies"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id = db.Column(UUID(as_uuid=True), db.ForeignKey("tenants.id"), nullable=False)

    company_number = db.Column(db.String, nullable=False)      # unique per tenant?
    company_name   = db.Column(db.String)
    company_status = db.Column(db.String)
    incorporation_date = db.Column(db.Date)
    address_line_1 = db.Column(db.String)
    address_line_2 = db.Column(db.String)
    locality       = db.Column(db.String)
    postal_code    = db.Column(db.String)
    country        = db.Column(db.String, default="United Kingdom")
    sic_codes      = db.Column(postgresql.ARRAY(db.String))
    is_monitored   = db.Column(db.Boolean, default=False)

    __table_args__ = (
        db.UniqueConstraint("tenant_id", "company_number", name="uq_company_tenant_number"),
    )
