import easyocr

reader = easyocr.Reader(['en'])  # you can add 'hi', 'fr', etc. for multilingual

def extract_text_from_image(image_path):
    result = reader.readtext(image_path, detail=0)  # detail=0 returns just text
    text = "\n".join(result)
    return text
