from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
from app.services.ocr import extract_text_from_image

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/upload', methods=['POST'])
def upload_file():
    print("Request headers:", request.headers)  # Debugging line
    print("Request files:", request.files)      # Debugging line
    print("Request form:", request.form)        # Debugging line

    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filename = secure_filename(file.filename)
    upload_path = os.path.join('temp_uploads', filename)

    os.makedirs('temp_uploads', exist_ok=True)  # ensure the folder exists
    file.save(upload_path)

    text = extract_text_from_image(upload_path)
    return jsonify({'ocr_text': text})