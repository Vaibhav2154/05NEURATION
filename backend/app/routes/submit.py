from flask import Blueprint, request, jsonify
from app.services.template import fill_template
from app.services.db import save_to_db

submit_bp = Blueprint("submit", __name__)

@submit_bp.route("/submit", methods=["POST"])
def submit():
    data = request.get_json()
    excel_path = fill_template(data)
    save_to_db(data)
    return jsonify({"message": "Data submitted", "excel": excel_path})
