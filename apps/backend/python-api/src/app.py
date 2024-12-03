from flask import Flask
from flask_cors import CORS
from routes.index import index as predictRoutes  # Import the Blueprint object
from routes.packingController import packingBluePrint

app = Flask(__name__)
CORS(app)

# Register the Blueprint
app.register_blueprint(predictRoutes)
app.register_blueprint(packingBluePrint)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
