from flask import Blueprint, request, jsonify
import os
from werkzeug.utils import secure_filename

upload_bp = Blueprint("upload", __name__)

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "txt", "pdf"}  # Add allowed file extensions

# Ensure the uploads directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_bp.route("/upload", methods=["POST"])
def upload_file():
<<<<<<< HEAD
    try:
        # Check if the file is in the request
        if "file" not in request.files:
            return jsonify({"error": "No file part in the request"}), 400

        file = request.files["file"]

        # Check if a file was selected
        if file.filename == "":
            return jsonify({"error": "No file selected for uploading"}), 400

        # Validate the file type
        if not allowed_file(file.filename):
            return jsonify({"error": "File type not allowed"}), 400

        # Secure the filename and save the file
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        # Prevent overwriting existing files
        if os.path.exists(filepath):
            return jsonify({"error": "File already exists"}), 400

        file.save(filepath)
        return jsonify({"message": "File uploaded successfully", "filepath": filepath}), 200

    except Exception as e:
        # Handle unexpected errors
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500
=======
    file = request.files["file"]
    filepath = "test1.png"
    file.save(filepath)
    return jsonify({"message": "File uploaded successfully", "filepath": filepath})
>>>>>>> cd7cf312622a978b1e5254111486d2e75b0cd5a4
