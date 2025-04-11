from flask import Blueprint, request, jsonify
from app.services.ocr import extract_text
from app.services.genai import extract_fields
import os

extract_bp = Blueprint("extract", __name__)

@extract_bp.route("/extract", methods=["POST"])
def extract():
    try:
        # Validate JSON payload
        data = request.get_json()
        if not data or "filepath" not in data:
            return jsonify({"error": "Missing 'filepath' in request data"}), 400

        filepath = data["filepath"]

        # Check if the file exists
        if not os.path.exists(filepath):
            return jsonify({"error": f"File not found: {filepath}"}), 404

        # Extract text and fields
        text = extract_text(filepath)
        extracted = extract_fields(text)

        return jsonify(extracted)

    except Exception as e:
        # Handle unexpected errors
        return jsonify({"error": str(e)}), 500