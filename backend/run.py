from flask import Flask
from app.routes import *

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
