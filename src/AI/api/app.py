from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf

model_path = "./src/AI/model/model.keras"
scaler_path = "./src/AI/model/scaler.keras"

model = model = tf.keras.models.load_model(model_path)
scaler = tf.keras.models.load_model(scaler_path)

app = Flask(__name__)


@app.route('/predict', methods=['GET'])
def predict():
    try:
        input_data = request.args.getlist('input', type=float)
        if not input_data:
            return jsonify({"error": "Invalid input"}), 400
        input_data = np.array(input_data).reshape(1, -1)
        input_data = scaler.transform(input_data)
        prediction = model.predict(input_data)
        return jsonify({"prediction": prediction.tolist()})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
