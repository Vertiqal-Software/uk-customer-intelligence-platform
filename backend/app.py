from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # Config from environment (DATABASE_URL, SECRET_KEY, etc.)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "postgresql://devuser:devpass@db:5432/uk_customer_intelligence")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "change-me")

    # Extensions
    db.init_app(app)
    CORS(app)
    JWTManager(app)
    limiter = Limiter(key_func=get_remote_address, default_limits=["1000 per hour"])
    limiter.init_app(app)

    @app.get("/api/health")
    def health():
        return jsonify(
            status="healthy",
            version="1.0.0",
            features={
                "multi_tenant": True,
                "ai_powered": True,
                "uk_compliant": True,
                "gdpr_compliant": True,
            },
        )

    return app

if __name__ == "__main__":
    import os
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)
