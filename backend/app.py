from flask import Flask, send_from_directory
from flask_restful import Api
from flask_cors import CORS
import os

from resources.disease_resource import DiseaseResource
from models.disease_model import create_table

# --- Compute the absolute path to the React build folder ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_BUILD_PATH = os.path.abspath(os.path.join(BASE_DIR, "../frontend/build"))

# --- Flask app setup ---
app = Flask(__name__, static_folder=FRONTEND_BUILD_PATH, static_url_path="")
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})
api = Api(app)

# --- API routes ---
api.add_resource(DiseaseResource, "/api/diseases")

# --- Serve React build ---
@app.route("/")
@app.route("/<path:path>")
def serve_react(path=""):
    """
    Serves the built React frontend from the build folder.
    If a file is requested and exists (like static JS/CSS),
    serve it directly. Otherwise, serve index.html to support client-side routing.
    """
    file_path = os.path.join(FRONTEND_BUILD_PATH, path)
    if path != "" and os.path.exists(file_path):
        return send_from_directory(FRONTEND_BUILD_PATH, path)
    else:
        return send_from_directory(FRONTEND_BUILD_PATH, "index.html")

# --- Run app ---
if __name__ == "__main__":
    create_table()
    print("Flask server started!")
    print("Serving React frontend from:", FRONTEND_BUILD_PATH)
    print("Files in build directory:", os.listdir(FRONTEND_BUILD_PATH))
    app.run(host="0.0.0.0", port=8080, debug=True)
