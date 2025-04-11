from flask import Flask
from app.routes.extract import extract_bp
from app.routes.submit import submit_bp
from app.routes.upload import upload_bp

def create_app():
    """Factory function to create and configure the Flask app."""
    app = Flask(__name__)

    # Register blueprints
    try:
        app.register_blueprint(extract_bp, url_prefix="/upload")
        app.register_blueprint(submit_bp, url_prefix="/extract")
        app.register_blueprint(upload_bp, url_prefix="/submi")
    except Exception as e:
        print(f"Error registering blueprints: {e}")

    return app