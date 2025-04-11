from flask import Flask
<<<<<<< HEAD
from flask_cors import CORS
from flask import Blueprint, request, jsonify

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Register the upload blueprint
    app.register_blueprint(upload_bp)

    return app

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/upload', methods=['GET'])
def upload():
    # Example response for the upload route
    return jsonify({"message": "Upload route is working!"})
=======
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
>>>>>>> 3fb081452ea1b347b8cbba976d5e7395aa7f2d82
