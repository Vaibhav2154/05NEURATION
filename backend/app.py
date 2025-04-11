# File: app.py
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
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
from supabase import create_client, Client
import uuid
from fpdf import FPDF

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("VITE_SUPABASE_KEY")
SUPABASE_SERVICE_KEY = os.getenv("VITE_SUPABASE_SERVICE_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
supabase_service: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

app = Flask(__name__)
CORS(app, supports_credentials=True)


# Configure Gemini
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in environment variables")
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash')

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "output"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}
reader = easyocr.Reader(['en'], gpu=False)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_image(image_path):
    results = reader.readtext(image_path, detail=0)
    return "\n".join(results)

def extract_text_from_pdf(pdf_path):
    poppler_path = r"C:\\poppler\\Library\\bin"
    pages = convert_from_path(pdf_path, poppler_path=poppler_path)
    all_text = []
    with tempfile.TemporaryDirectory() as temp_dir:
        for i, page in enumerate(pages):
            image_path = os.path.join(temp_dir, f"page_{i}.png")
            page.save(image_path, "PNG")
            text = extract_text_from_image(image_path)
            all_text.append(text)
    return "\n".join(all_text)

def extract_invoice_fields(text):
    prompt = f"""
Extract the following fields from the invoice text below:
- invoice_number
- vendor
- date
- amount (only numbers)
- tax (only numbers)
Return the result as a JSON object.
If a field is not found, use an empty string.
Example Output:
{{
  "invoice_number": "INV-001",
  "vendor": "ABC Pvt Ltd",
  "amount": "\u20b95000",
  "tax": "\u20b9500",
  "date": "2025-04-01"
}}
Input Text:
{text}
"""
    response = model.generate_content(prompt)
    cleaned = re.sub(r'```json|```', '', response.text).strip()
    return json.loads(cleaned)

@app.route('/')
def home():
    return "Invoice Processing API is running. Use POST /extract to process invoices."

@app.route('/extract', methods=['POST'])
def handle_extract():
    try:
        if 'file' not in request.files or 'user_id' not in request.form:
            print("[Error] Missing file or user_id")
            return jsonify({"error": "File or user ID missing"}), 400

        file = request.files['file']
        user_id = request.form['user_id']
        filename = file.filename.lower()
        print(f"[Info] Received file: {filename}, user_id: {user_id}")

        if not allowed_file(filename):
            print("[Error] Unsupported file format")
            return jsonify({"error": "Unsupported file format"}), 400

        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        print("[Info] File saved. Running OCR...")

        ocr_text = extract_text_from_pdf(filepath) if filename.endswith('.pdf') else extract_text_from_image(filepath)
        print("[Info] OCR complete. Extracting fields...")

        fields = extract_invoice_fields(ocr_text)
        print("[Info] Extracted fields:", fields)

        fields['user_id'] = user_id
        fields['num'] = str(uuid.uuid4())

        response = supabase_service.table("invoices").insert(fields).execute()
        print("[Info] Supabase raw response:", response)

        if hasattr(response, 'error') and response.error:
            print("[Error] Supabase insert failed:", response.error)
            raise Exception(str(response.error))

        if hasattr(response, 'data'):
            print("[Info] Inserted data:", response.data)

        return jsonify({ "fields": fields, "message": "Invoice processed and saved" })

    except Exception as e:
        print("[Exception]", str(e))
        return jsonify({ "error": str(e) }), 500

@app.route('/download', methods=['GET'])
def download():
    filename = request.args.get('file')
    if not filename:
        return jsonify({"error": "No file specified"}), 400
    path = os.path.join(OUTPUT_FOLDER, filename)
    if not os.path.exists(path):
        return jsonify({"error": "File not found"}), 404
    return send_file(path, as_attachment=True)

@app.route('/export', methods=['GET'])
def export_invoices():
    user_id = request.args.get('user_id')
    export_format = request.args.get('format', 'excel')

    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    try:
        response = supabase_service.table("invoices").select("*").eq("user_id", user_id).execute()
        invoices = response.data  # This now works as expected
    except Exception as e:
        print("[Export Error]", str(e))
        return jsonify({"error": str(e)}), 500


    filename = f"invoices_{user_id}.{ 'xlsx' if export_format == 'excel' else 'pdf'}"
    path = os.path.join(OUTPUT_FOLDER, filename)

    if export_format == 'excel':
        df = pd.DataFrame(invoices)
        df.to_excel(path, index=False)
    else:
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=10)

        for inv in invoices:
            for k, v in inv.items():
                pdf.cell(200, 8, txt=f"{k}: {v}", ln=True)
            pdf.ln(5)

        pdf.output(path)

    return send_file(path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
