from flask import Flask, request, jsonify
import joblib
import numpy as np

model_path = "./src/AI/model/model.pkl"
scaler_path = "./src/AI/model/scaler.pkl"

model = joblib.load(model_path)
scaler = joblib.load(scaler_path)

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
