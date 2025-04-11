from flask import Blueprint, request, jsonify
from app.services.template import fill_template
from app.services.db import save_to_db

submit_bp = Blueprint("submit", __name__)

@submit_bp.route("/submit", methods=["POST"])
def submit():
    try:
        # Validate JSON payload
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid or missing JSON payload"}), 400

        # Fill the template and save the data
        try:
            excel_path = fill_template(data)
        except Exception as e:
            return jsonify({"error": f"Error filling template: {str(e)}"}), 500

        try:
            save_to_db(data)
        except Exception as e:
            return jsonify({"error": f"Error saving to database: {str(e)}"}), 500

        return jsonify({"message": "Data submitted successfully", "excel": excel_path}), 200

    except Exception as e:
        # Handle unexpected errors
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500