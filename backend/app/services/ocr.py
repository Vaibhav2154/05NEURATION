import pytesseract
from PIL import Image, UnidentifiedImageError
import os

def extract_text(filepath):
    try:
        # Check if the file exists
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"File not found: {filepath}")

        # Open the image file
        image = Image.open(filepath)

        # Extract text using pytesseract
        return pytesseract.image_to_string(image)

    except FileNotFoundError as fnf_error:
        raise fnf_error  # Re-raise the file not found error

    except UnidentifiedImageError:
        raise ValueError(f"The file at {filepath} is not a valid image.")

    except Exception as e:
        raise RuntimeError(f"An error occurred while processing the image: {str(e)}")