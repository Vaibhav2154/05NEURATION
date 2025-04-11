from flask import Blueprint, request, jsonify
from app.services.genai import extract_fields

extract_bp = Blueprint('extract_bp', __name__)  # ✅ name must match in registration!

@extract_bp.route('/extract', methods=['POST'])
def extract():
    data = request.get_json()
    ocr_text = data.get('ocr_text')
    fields = extract_fields(ocr_text)
    return jsonify(fields)
