from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
import joblib  # Added import for joblib

model_path = "./src/AI/model/model.keras"
scaler_path = "./src/AI/model/scaler.pkl"  # Updated file extension to .pkl for consistency

model = tf.keras.models.load_model(model_path)
scaler = joblib.load(scaler_path)  # Updated to use joblib.load

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        input_data = request.json.get('input')
        if not input_data:
            return jsonify({"error": "Invalid input"}), 400
        if len(input_data) != 9:
            return jsonify({"error": "Invalid input length"}), 400
        if input_data[2] not in [4, 5, 6]:
            return jsonify({"error": "Invalid tier"}), 400
        input_data = np.array(input_data).reshape(1, -1)
        print(input_data)
        input_data = scaler.transform(input_data)
        prediction = model.predict(input_data)
        return jsonify({"prediction": prediction.tolist()})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5555)
