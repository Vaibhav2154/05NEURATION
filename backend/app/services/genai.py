import openai
from app.config import OPENAI_API_KEY

openai.api_key = OPENAI_API_KEY

def extract_fields(text):
    prompt = f"""
Extract the following fields: Invoice Number, Date, Vendor, Total Amount, Tax.  
Input: {text}  
Output (in JSON format): 
"""
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return eval(response.choices[0].message['content'])  # Be careful with eval in production
