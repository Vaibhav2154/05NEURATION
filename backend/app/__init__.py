from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    from .routes.upload import upload_bp
    from .routes.extract import extract_bp
    from .routes.submit import submit_bp

    app.register_blueprint(upload_bp)
    app.register_blueprint(extract_bp)
    app.register_blueprint(submit_bp)

    return app
