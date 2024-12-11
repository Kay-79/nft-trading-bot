import os
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import xgboost as xgb
from sklearn.metrics import mean_squared_error, r2_score
import joblib


def load_data(file_path):
    if not os.path.exists(file_path):
        return None
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        return data
    except Exception as e:
        return None


file_path = "./src/AI/data/datasets.json"
data = load_data(file_path)

if data is not None:
    inputs = [item["input"] for item in data]
    outputs = [item["output"][0] for item in data]

    X = np.array(inputs)
    y = np.array(outputs)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    model = xgb.XGBRegressor(objective='reg:squarederror',
                             n_estimators=1000, learning_rate=0.1, max_depth=10, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)

    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print(f"Mean Squared Error: {mse}")
    print(f"R^2: {r2}")
    model_path = "./src/AI/model/model.pkl"
    scaler_path = "./src/AI/model/scaler.pkl"
    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    print(f"Model saved to {model_path}")
    print(f"Scaler saved to {scaler_path}")
else:
    print("Data not loaded")
