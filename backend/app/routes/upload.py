from flask import Blueprint, request, jsonify
import os

upload_bp = Blueprint("upload", __name__, url_prefix='/api')

@upload_bp.route("/upload", methods=["POST"])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400
            
        file = request.files["file"]
        
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
            
        # Create uploads directory if it doesn't exist
        upload_dir = os.path.join(os.getcwd(), "uploads")
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
            
        filepath = os.path.join(upload_dir, file.filename)
        file.save(filepath)
        
        return jsonify({
            "message": "File uploaded successfully", 
            "filepath": filepath
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
