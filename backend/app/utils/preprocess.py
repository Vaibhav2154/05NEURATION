import cv2

def preprocess_image(path):
    image = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    image = cv2.threshold(image, 150, 255, cv2.THRESH_BINARY)[1]
    image = cv2.GaussianBlur(image, (1, 1), 0)
    return path  # returning the same path for simplicity
