from flask import Flask, send_from_directory
from flask_restful import Api
from flask_cors import CORS
import os

from resources.disease_resource import DiseaseResource
from models.disease_model import create_table

# --- Flask App Config ---
app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")
CORS(app)
api = Api(app)

# --- API Routes ---
api.add_resource(DiseaseResource, '/api/diseases')

# --- Serve React Frontend ---
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    build_dir = app.static_folder
    file_path = os.path.join(build_dir, path)
    if os.path.exists(file_path):
        return send_from_directory(build_dir, path)
    else:
        return send_from_directory(build_dir, "index.html")

# --- Run App ---
if __name__ == "__main__":
    create_table()
    app.run(debug=True, port=5000)
