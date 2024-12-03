from flask import Flask
from flask_cors import CORS
from routes.index import index as predictRoutes  # Import the Blueprint object

app = Flask(__name__)
CORS(app)

# Register the Blueprint
app.register_blueprint(predictRoutes)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
