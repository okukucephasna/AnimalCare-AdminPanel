from flask_restful import Resource, reqparse
from models.disease_model import add_disease, get_all_diseases

class DiseaseResource(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('name', type=str, required=True, help="Disease name required")
        self.parser.add_argument('symptoms', type=str, required=True, help="Symptoms required")

    def get(self):
        return {"diseases": get_all_diseases()}

    def post(self):
        data = self.parser.parse_args()
        add_disease(data['name'], data['symptoms'])
        return {"message": "Disease added successfully"}, 201
