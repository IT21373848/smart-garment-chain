from flask import Blueprint, request, jsonify
from services.packing.packingService import generate_packing_plan

packingBluePrint = Blueprint('packingController', __name__) 

@packingBluePrint.route('/packing-prediction', methods=['POST'])
def packingController():
    try:
        data = request.json
        box_data = data.get("box_data")
        container_type = data.get("container_type")

        if not box_data or not container_type:
            return jsonify({"error": "Missing required parameters"}), 400

        result = generate_packing_plan(box_data, container_type)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500