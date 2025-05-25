from flask import Flask
from flask_cors import CORS
from routes.index import index as predictRoutes  # Import the Blueprint object
from routes.packingController import packingBluePrint
from routes.supplierSelection import supplierSelection
from routes.vehiclePredict import predictVehicle

app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/*": {"origins": "*"}})  

# Register Blueprint
app.register_blueprint(predictVehicle)
app.register_blueprint(predictRoutes)
app.register_blueprint(packingBluePrint)
app.register_blueprint(supplierSelection)

if __name__ == '__main__':
   app.run(host="0.0.0.0", port=5001)

