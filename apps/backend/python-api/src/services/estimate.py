import joblib
import numpy as np
import pandas as pd
# from sklearn.preprocessing import StandardScaler, LabelEncoder
# import os
from flask import request, jsonify

# PREDICT MAN HOURS
# Load the trained model
model_path = './models/stacked_modelup-v4.joblib'
stacked_model = joblib.load(model_path)
def predict_man_hours():
    try:
        # Get JSON data from request
        data = request.json
        
        # Extract input features
        input_data = pd.DataFrame([{
            "Type of clothing": data['item'],  # Keep as string for OneHotEncoder
            "Number of production lines": float(data['lines']),
            "Number of employees": float(data['emp']),
            "Quantity of order": float(data['qty']),
            "Elapsed time (hours)": float(data['elapsed'])
        }])

        # Ensure input follows model's preprocessing pipeline
        predicted_man_hours = stacked_model.predict(input_data)

        # Round the predicted value
        predicted_man_hours_rounded = np.ceil(predicted_man_hours[0])

        return jsonify({"Predicted Man Hours": int(predicted_man_hours_rounded)})
    
    except KeyError as e:
        return jsonify({"error": f"Missing field {str(e)}"}), 400

    except ValueError as e:
        return jsonify({"error": f"Invalid input: {str(e)}"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500