from flask import Blueprint, request, jsonify

packingBluePrint = Blueprint('packingController', __name__) 

@packingBluePrint.route('/packing-prediction', methods=['POST'])
def packingController():
    try:
        input_data = request.json.get('input_data', [])
        if not input_data:
            return jsonify({"error": "No input data provided"}), 400
        
        return jsonify({"input_data": input_data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
