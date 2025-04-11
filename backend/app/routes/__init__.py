from flask import Flask
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
