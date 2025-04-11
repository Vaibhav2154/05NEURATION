from flask import Blueprint, request, jsonify
import os

upload_bp = Blueprint("upload", __name__)

@upload_bp.route("/upload", methods=["POST"])
def upload_file():
    file = request.files["file"]
    filepath = os.path.join("uploads", file.filename)
    file.save(filepath)
    return jsonify({"message": "File uploaded successfully", "filepath": filepath})
