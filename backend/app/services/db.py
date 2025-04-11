from supabase import create_client
from app.config import SUPABASE_URL, SUPABASE_KEY

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def save_to_supabase(data):
    response = supabase.table("bills").insert(data).execute()
    return response.status_code == 201
