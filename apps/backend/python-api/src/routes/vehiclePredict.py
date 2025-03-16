from flask import Blueprint, request, jsonify
from utils.vehicle_utils import optimal_vehicle_strategy
from data.vehicles import vehicles

predictVehicle = Blueprint('predictVehicle', __name__)

@predictVehicle.route('/predict-vehicle', methods=['POST'])
def recommend_vehicle():
    data = request.json
    deliveries = data['deliveries']
    distance = data['distance_km']

    total_volume = sum(d['volume_cft'] for d in deliveries)
    total_weight = sum(d['weight_kg'] for d in deliveries)

    optimal_strategy = optimal_vehicle_strategy(total_volume, total_weight, distance)

    return jsonify({
        "strategy": optimal_strategy['strategy'],
        "vehicles": optimal_strategy['vehicles'],
        "total_estimated_cost_LKR": optimal_strategy['estimated_cost_LKR'],
        "total_distance_km": distance,
        "total_volume_cft": total_volume,
        "total_weight_kg": total_weight
    })
