from flask import Blueprint, request, jsonify
import os
from werkzeug.utils import secure_filename

upload_bp = Blueprint("upload", __name__, url_prefix='/api')

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "txt", "pdf"}  # Add allowed file extensions

# Ensure the uploads directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_bp.route("/upload", methods=["POST"])
def upload_file():
    file = request.files["file"]
    filepath = "test1.png"
    file.save(filepath)
    return jsonify({"message": "File uploaded successfully", "filepath": filepath})
