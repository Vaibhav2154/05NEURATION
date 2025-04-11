from flask import Blueprint, request, jsonify
<<<<<<< HEAD
from app.services.template import fill_excel_template
from app.services.db import save_to_supabase

submit_bp = Blueprint('submit', __name__)
=======
from app.services.template import fill_template
from app.services.db import supabase
import os

submit_bp = Blueprint('submit', __name__, url_prefix='/api')
>>>>>>> 3fb081452ea1b347b8cbba976d5e7395aa7f2d82

@submit_bp.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    excel_path = fill_excel_template(data)
    db_status = save_to_supabase(data)
    return jsonify({"excel_saved_at": excel_path, "db_status": db_status})
