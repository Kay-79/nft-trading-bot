import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import RobustScaler
import os
import json
import joblib
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.optimizers import Adam
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


file_path = "./src/AI/data/moboxDatasets.json"
data = load_data(file_path)

X = np.array([d["input"] for d in data])
y = np.array([d["output"] for d in data])

# import matplotlib.pyplot as plt
# # Lọc các giá trị y lớn hơn 1000
# large_y_indices = np.where(y > 1100)  # Lấy chỉ số của các giá trị y > 1000
# large_y_values = y[large_y_indices]  # Lấy giá trị thực tế

# # Log các giá trị này
# print("Indices of y > 1000:", large_y_indices[0])  # Chỉ số các giá trị lớn hơn 1000
# print("Values of y > 1000:", large_y_values)       # Giá trị tương ứng
# print(f"Total count of y > 1000: {len(large_y_values)}")  # Tổng số lượng
# plt.figure(figsize=(10, 6))  # Tăng kích thước biểu đồ
# plt.hist(y, bins=20, color='skyblue', edgecolor='black', alpha=0.7)
# plt.title("Distribution of y", fontsize=16)
# plt.xlabel("Value of y", fontsize=14)
# plt.ylabel("Frequency", fontsize=14)
# plt.grid(axis='y', linestyle='--', alpha=0.7)  # Thêm lưới để dễ quan sát
# plt.xticks(fontsize=12)
# plt.yticks(fontsize=12)
# plt.tight_layout()  # Tự động điều chỉnh khoảng cách để các nhãn không bị tràn
# plt.show()
# exit()

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

scaler = RobustScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

model = tf.keras.Sequential([
    tf.keras.layers.Dense(64, activation='relu',
                          input_shape=(X_train.shape[1],)),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(1)
])

model.compile(optimizer='adam', loss='mse', metrics=['mae'])

sample_weights = np.linspace(0.01, 1.0, num=len(y_train))
early_stopping = EarlyStopping(
    monitor='val_loss', patience=30, restore_best_weights=True)
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

model_path = "./src/AI/model/model.pkl"
scaler_path = "./src/AI/model/scaler.pkl"
joblib.dump(model, model_path)
joblib.dump(scaler, scaler_path)
print(f"Model saved to {model_path}")
print(f"Scaler saved to {scaler_path}")
print("Model training completed with datasets length: ", len(X_train))
