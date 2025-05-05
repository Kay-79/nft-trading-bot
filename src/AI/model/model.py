import joblib
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import RobustScaler
import os
import json
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.optimizers import Adam


def load_data(file_path):
    if not os.path.exists(file_path):
        return None
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        return data
    except Exception as e:
        return None


file_path = "./backupData/datasets.json"
data = load_data(file_path)

X = []
y = []

for d in data:
    try:
        momo_info = d.get("momoInfo", [])
        momo_equipment = d.get("momoEquipment", [])
        bid_time = d.get("bidTime", 0)

        features = momo_info + momo_equipment + [bid_time]
        features = [float(f) for f in features]

        X.append(features)
        y.append([float(d["output"][0])])
    except (ValueError, KeyError, TypeError):
        print(f"Skipping invalid data entry: {d}")

X = np.array(X)
y = np.array(y)
print("X shape: ", X.shape)
print("y shape: ", y.shape)

if X.size == 0 or y.size == 0:
    raise ValueError("No valid data available for training.")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.0001, random_state=42)

scaler = RobustScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(X_train.shape[1],)),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(1)
])

model.compile(optimizer='adam', loss='mse', metrics=['mae'])

sample_weights = np.linspace(0.01, 1.0, num=len(y_train))
early_stopping = EarlyStopping(
    monitor='val_loss', patience=1000, restore_best_weights=True)
reduce_lr = ReduceLROnPlateau(
    monitor='val_loss', factor=0.5, patience=30, min_lr=1e-6)

optimizer = Adam(learning_rate=0.001)

model.compile(optimizer=optimizer, loss=tf.keras.losses.Huber(
    delta=1.0), metrics=['mae', 'mape'])


model.fit(
    X_train, y_train,
    epochs=5000,
    batch_size=16,
    validation_split=0.2,
    sample_weight=sample_weights,
    callbacks=[early_stopping, reduce_lr]
)

loss, mae, mape = model.evaluate(X_test, y_test)
print(
    f"Test Loss: {loss}, Test MAE: {mae}, Test MAPE: {mape}")

model_path = "./src/AI/model/model.keras"
# Updated file extension to .pkl for consistency
scaler_path = "./src/AI/model/scaler.pkl"
model.save(model_path)
joblib.dump(scaler, scaler_path)  # Ensure the scaler is saved correctly

print(f"Model saved to {model_path}")
print(f"Scaler saved to {scaler_path}")
print("Model training completed with datasets length: ", len(X_train))
