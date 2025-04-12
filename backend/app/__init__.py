from flask import Flask
from flask_cors import CORS
from app.routes.extract import extract_bp  # Import the extract blueprint

def create_app():
    app = Flask(__name__)
    CORS(app)

    from .routes.upload import upload_bp
    from .routes.submit import submit_bp
    
    # Register blueprints
    app.register_blueprint(upload_bp)
    app.register_blueprint(extract_bp)
    app.register_blueprint(submit_bp)
    
    def print_routes():
        print("🔍 Available routes:")
        for rule in app.url_map.iter_rules():
            print(f"{rule} ({', '.join(rule.methods)})")
    
    print_routes()

    @app.route('/', methods=['GET'])
    def index():
        return "InvoSync API is running"

    return app
