from supabase import create_client

url = "https://rgiutfocjoulkzjcnboy.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnaXV0Zm9jam91bGt6amNuYm95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMTY3OTksImV4cCI6MjA1OTY5Mjc5OX0.BlpNpuVh7gHqatQN_EjsaQk4OS-Wk3f5_9CEnVMQ5tg"
supabase = create_client(url, key)

def save_to_db(data):
    supabase.table("User").insert(data).execute()
