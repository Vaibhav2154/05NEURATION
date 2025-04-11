from flask import Blueprint, request, jsonify
from app.services.ocr import extract_text
from app.services.genai import extract_fields
from app.services.db import save_to_db
import os

extract_bp = Blueprint('extract_bp', __name__)  # ✅ name must match in registration!

@extract_bp.route('/api/extract', methods=['POST'])
def extract_bill():
    try:
        file = request.files['file']
        filename = file.filename
        filepath = os.path.join("temp", filename)
        file.save(filepath)

        ocr_text = extract_text(filepath)
        structured_data = extract_fields(ocr_text)

        save_to_db({
            "invoice_number": structured_data.get("invoice_number", ""),
            "vendor": structured_data.get("vendor", ""),
            "amount": structured_data.get("amount", ""),
            "tax": structured_data.get("tax", ""),
            "date": structured_data.get("date", ""),
            "reviewed": False,
            "original_filename": filename
        })

        return jsonify({
            "ocr_text": ocr_text,
            "structured_data": structured_data
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@extract_bp.route('/api/test', methods=['GET'])
def test_route():
    return jsonify({"message": "Test route is working!"}), 200

