from flask import Blueprint, request, jsonify
from app.services.template import fill_excel_template
from app.services.db import save_to_supabase

submit_bp = Blueprint('submit', __name__)

@submit_bp.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    excel_path = fill_excel_template(data)
    db_status = save_to_supabase(data)
    return jsonify({"excel_saved_at": excel_path, "db_status": db_status})
