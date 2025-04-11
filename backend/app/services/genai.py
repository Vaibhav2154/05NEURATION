import openai

openai.api_key = "your-api-key"

def extract_fields(text):
    prompt = f"""
    Extract the following fields: Invoice Number, Date, Vendor, Total Amount, Tax.
    Input: {text}
    """
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return response["choices"][0]["message"]["content"]
