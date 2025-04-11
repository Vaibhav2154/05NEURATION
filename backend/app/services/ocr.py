import pytesseract
from PIL import Image

def extract_text(filepath):
    image = Image.open(filepath)
    return pytesseract.image_to_string(image)
