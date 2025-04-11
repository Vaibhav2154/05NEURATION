from flask import Blueprint, request, jsonify
from app.services.template import fill_template
from app.services.db import supabase
import os

submit_bp = Blueprint('submit', __name__, url_prefix='/api')

@submit_bp.route("/submit", methods=["POST"])
def submit():
    data = request.get_json()
    excel_path = fill_template(data)
    save_to_db(data)
    return jsonify({"message": "Data submitted", "excel": excel_path})

    except Exception as e:
        # Handle unexpected errors
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500