from flask import Blueprint, request, jsonify
from services.estimate import predict_man_hours  # Import the service function

# Create a Blueprint instance
index = Blueprint('index', __name__)

# health api
@index.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "OK"})

@index.route('/predict', methods=['POST'])
def predict():
    # Call the service function to handle the prediction
    return predict_man_hours()

