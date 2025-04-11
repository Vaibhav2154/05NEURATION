from supabase import create_client

url = "your-supabase-url"
key = "your-supabase-key"
supabase = create_client(url, key)

def save_to_db(data):
    supabase.table("bills").insert(data).execute()
