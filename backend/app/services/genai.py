import google.generativeai as genai
import os
import re
import json

# Get the API key securely
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    api_key = "REMOVED"

genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.0-flash')

def extract_fields(text):
    prompt = f"""
You are an intelligent invoice extraction assistant.

Extract the following fields from the provided bill or invoice text. The text is OCR extracted from scanned images or PDFs.

Required fields:
- invoice_number
- vendor
- date
- amount
- tax

Instructions:
- Use the exact field names in the JSON output.
- If a value is missing, leave it as an empty string.
- Only return a valid JSON object and nothing else.

Example Output:
{{
  "invoice_number": "INV-001",
  "vendor": "ABC Corp",
  "amount": "₹5,000",
  "tax": "₹500",
  "date": "2025-04-01"
}}

Extract from this input:
{text}
"""

    try:
        response = model.generate_content(prompt)
        cleaned_response = re.sub(r'```(?:json)?\n?|```', '', response.text).strip()

        # Parse the result
        result = json.loads(cleaned_response)

        # Ensure all expected keys are present
        for key in ["invoice_number", "vendor", "amount", "tax", "date"]:
            if key not in result:
                result[key] = ""

        return result

    except Exception as e:
        raise RuntimeError(f"GenAI parsing failed: {str(e)}")
