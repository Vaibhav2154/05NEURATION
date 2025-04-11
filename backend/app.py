from flask import Flask, request, jsonify, send_file
import os
import re
import json
import google.generativeai as genai
import easyocr
import pandas as pd
from dotenv import load_dotenv
from datetime import datetime
from pdf2image import convert_from_path
import tempfile

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure Gemini
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY not found in environment variables")
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.0-flash')

# Setup folders
UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "output"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}

# Initialize EasyOCR
reader = easyocr.Reader(['en'], gpu=False)

# Check allowed extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# OCR for images
def extract_text_from_image(image_path):
    results = reader.readtext(image_path, detail=0)
    return "\n".join(results)

# OCR for PDFs
def extract_text_from_pdf(pdf_path):
    poppler_path = r"C:\poppler\Library\bin"  # <- adjust this to your actual poppler path
    pages = convert_from_path(pdf_path, poppler_path=poppler_path)
    
    all_text = []
    with tempfile.TemporaryDirectory() as temp_dir:
        for i, page in enumerate(pages):
            image_path = os.path.join(temp_dir, f"page_{i}.png")
            page.save(image_path, "PNG")
            text = extract_text_from_image(image_path)
            all_text.append(text)
    return "\n".join(all_text)


# Use Gemini to extract fields
def extract_invoice_fields(text):
    prompt = f"""
Extract the following fields from the invoice text below:
- invoice_number
- vendor
- date
- amount
- tax

Return the result as a JSON object.
If a field is not found, use an empty string.

Example Output:
{{
  "invoice_number": "INV-001",
  "vendor": "ABC Pvt Ltd",
  "amount": "₹5000",
  "tax": "₹500",
  "date": "2025-04-01"
}}

Input Text:
{text}
"""
    response = model.generate_content(prompt)
    cleaned = re.sub(r'```json|```', '', response.text).strip()
    return json.loads(cleaned)

# Save to Excel
def save_to_excel(data):
    filename = f"invoice_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    filepath = os.path.join(OUTPUT_FOLDER, filename)
    df = pd.DataFrame([data])
    df.to_excel(filepath, index=False)
    return filepath

@app.route('/')
def home():
    return "Invoice Processing API is running. Use POST /extract to process invoices."

@app.route('/extract', methods=['POST'])
def handle_extract():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    filename = file.filename.lower()

    if not allowed_file(filename):
        return jsonify({"error": "Unsupported file format"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    try:
        if filename.endswith('.pdf'):
            ocr_text = extract_text_from_pdf(filepath)
        else:
            ocr_text = extract_text_from_image(filepath)

        fields = extract_invoice_fields(ocr_text)
        excel_path = save_to_excel(fields)

        return jsonify({
            "fields": fields,
            "excel_file": excel_path
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/download', methods=['GET'])
def download():
    filename = request.args.get('file')
    if not filename:
        return jsonify({"error": "No file specified"}), 400
    path = os.path.join(OUTPUT_FOLDER, filename)
    if not os.path.exists(path):
        return jsonify({"error": "File not found"}), 404
    return send_file(path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
