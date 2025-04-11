backend/
├── app/
│   ├── __init__.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── upload.py         # /upload
│   │   ├── extract.py        # /extract
│   │   ├── submit.py         # /submit
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ocr.py            # OCR logic
│   │   ├── genai.py          # OpenAI GPT field extraction
│   │   ├── template.py       # Fill Excel template
│   │   ├── db.py             # Supabase integration
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── preprocess.py     # Image preprocessing
│   └── config.py
├── run.py                    # Flask app entry point
├── requirements.txt
