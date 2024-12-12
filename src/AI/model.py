import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import os
import json
import joblib
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
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


file_path = "./src/AI/data/datasets.json"
data = load_data(file_path)

X = np.array([d["input"] for d in data])
y = np.array([d["output"] for d in data])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

model = tf.keras.Sequential([
    tf.keras.layers.Dense(64, activation='relu',
                          input_shape=(X_train.shape[1],)),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(1)
])

model.compile(optimizer='adam', loss='mse', metrics=['mae'])

sample_weights = np.linspace(0.5, 1.0, num=len(y_train))
early_stopping = EarlyStopping(
    monitor='val_loss', patience=100, restore_best_weights=True)
reduce_lr = ReduceLROnPlateau(
    monitor='val_loss', factor=0.5, patience=10, min_lr=1e-6)

optimizer = Adam(learning_rate=0.001)

model.compile(
    optimizer=optimizer,
    loss='mse',
    metrics=['mae', 'mape'],
    weighted_metrics=['mae']
)

history = model.fit(
    X_train, y_train,
    epochs=5000,
    batch_size=16,
    validation_split=0.2,
    sample_weight=sample_weights,
    callbacks=[early_stopping, reduce_lr]
)

loss, mae, mape, weighted_mae = model.evaluate(X_test, y_test)
print(
    f"Test Loss: {loss}, Test MAE: {mae}, Test MAPE: {mape}, Weighted MAE: {weighted_mae}")

model_path = "./src/AI/model/model.pkl"
scaler_path = "./src/AI/model/scaler.pkl"
joblib.dump(model, model_path)
joblib.dump(scaler, scaler_path)
print(f"Model saved to {model_path}")
print(f"Scaler saved to {scaler_path}")
print("Model training completed with datasets length: ", len(X_train))
