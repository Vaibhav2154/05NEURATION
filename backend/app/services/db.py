import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

<<<<<<< HEAD
url = "https://rgiutfocjoulkzjcnboy.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnaXV0Zm9jam91bGt6amNuYm95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMTY3OTksImV4cCI6MjA1OTY5Mjc5OX0.BlpNpuVh7gHqatQN_EjsaQk4OS-Wk3f5_9CEnVMQ5tg"
supabase = create_client(url, key)

def save_to_db(data):
    supabase.table("User").insert(data).execute()
=======
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
>>>>>>> cd7cf312622a978b1e5254111486d2e75b0cd5a4
