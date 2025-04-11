from flask import Blueprint, request, jsonify
from app.services.template import fill_template
from app.services.db import supabase
import os

submit_bp = Blueprint('submit', __name__, url_prefix='/api')

@submit_bp.route('/submit', methods=['POST'])
def submit_invoice():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        # Create output directory if it doesn't exist
        output_dir = os.path.join(os.getcwd(), "output")
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        path = fill_template(data)

        # Optional: mark as reviewed
        invoice_number = data.get("invoice_number")
        if invoice_number:
            try:
                supabase.table("invoices").update({"reviewed": True}).eq("invoice_number", invoice_number).execute()
            except Exception as e:
                return jsonify({"template_path": path, "db_warning": str(e)}), 200

        return jsonify({"template_path": path})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
