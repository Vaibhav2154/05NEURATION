import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

supabase = create_client(url, key)

def save_to_db(data):
    """
    Save invoice data to Supabase database
    
    Args:
        data (dict): Invoice data containing fields like invoice_number, date, vendor, etc.
        
    Returns:
        dict: The response from the Supabase insert operation
    """
    try:
        # Insert data into 'invoices' table
        # Adjust table name according to your actual Supabase setup
        response = supabase.table('invoices').insert(data).execute()
        return response.data
    except Exception as e:
        print(f"Error saving to database: {e}")
        return {"error": str(e)}
