import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
import os
from flask import Blueprint, request, jsonify

current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, 'models', 'stacked_modelup.joblib')

# model_path = 'modesl/stacked_model.joblib'  
stacked_model = joblib.load(model_path)

df = pd.read_excel(os.path.join(current_dir, 'models', 'New Garment_production_dataset.xlsx'))  

label_encoder = LabelEncoder()
df['Type of clothing'] = label_encoder.fit_transform(df['Type of clothing'])

scaler = StandardScaler()
X = df.drop(columns=['Man hours'])
scaler.fit(X)

def predict_man_hours():
    try:
        data = request.json
        type_of_clothing_str = data['Type of clothing']
        production_line_number = float(data['Production line number'])
        number_of_employees = float(data['Number of employees'])
        quantity_of_order = float(data['Quantity of order'])
        elapsed_time = float(data['Elapsed time'])

        try:
            type_of_clothing = label_encoder.transform([type_of_clothing_str])[0]
        except ValueError:
            return jsonify({"error": f"{type_of_clothing_str} is not a recognized clothing type"}), 400

        input_data = np.array([[type_of_clothing, production_line_number, number_of_employees, quantity_of_order, elapsed_time]])

        input_data_scaled = scaler.transform(input_data)

        predicted_man_hours = stacked_model.predict(input_data_scaled)

        predicted_man_hours_rounded = np.ceil(predicted_man_hours[0])

        return jsonify({"Predicted Man Hours": int(predicted_man_hours_rounded)})
    
    except KeyError as e:
        return jsonify({"error": f"Missing field {str(e)}"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

