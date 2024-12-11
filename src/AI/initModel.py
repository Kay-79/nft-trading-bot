import os
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import xgboost as xgb
from catboost import CatBoostRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import matplotlib.pyplot as plt
import seaborn as sns


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

    model = CatBoostRegressor(
        iterations=900,
        learning_rate=0.03,
        depth=4,
        random_seed=42,
        loss_function='RMSE',
        verbose=100
    )

    model.fit(
        X_train, y_train
    )

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

    plt.figure(figsize=(8, 6))
    plt.scatter(y_test, y_pred, color='blue', alpha=0.7, label='Dự đoán vs. Thực tế')
    plt.plot([min(y_test), max(y_test)], [min(y_test), max(y_test)], color='red', linestyle='--', label='Ideal line (y = x)')

    plt.title('Biểu đồ Dự đoán vs. Thực tế', fontsize=16)
    plt.xlabel('Giá trị thực', fontsize=14)
    plt.ylabel('Giá trị dự đoán', fontsize=14)
    plt.legend()
    plt.grid(True)
    plt.show()

    errors = y_test - y_pred
    plt.figure(figsize=(8, 6))
    plt.bar(range(len(errors)), errors, color='orange')
    plt.title('Biểu đồ Sai số Dự đoán', fontsize=16)
    plt.xlabel('Index', fontsize=14)
    plt.ylabel('Sai số (Giá trị thực - Dự đoán)', fontsize=14)
    plt.grid(True)
    plt.show()

    plt.figure(figsize=(8, 6))
    sns.histplot(errors, kde=True, color='green', bins=10)
    plt.title('Phân phối Sai số Dự đoán', fontsize=16)
    plt.xlabel('Sai số (Giá trị thực - Dự đoán)', fontsize=14)
    plt.ylabel('Tần suất', fontsize=14)
    plt.show()

else:
    print("Data not loaded")
