from flask import Blueprint, request, jsonify
from app.services.ocr import extract_text
from app.services.genai import extract_fields

extract_bp = Blueprint('extract_bp', __name__)  # ✅ name must match in registration!

@extract_bp.route("/extract", methods=["POST"])
def extract():
    data = request.get_json()
    text = extract_text(data["filepath"])
    extracted = extract_fields(text)
    return jsonify(extracted)

    except Exception as e:
        # Handle unexpected errors
        return jsonify({"error": str(e)}), 500