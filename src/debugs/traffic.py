import json
from datetime import datetime
from collections import Counter
import os
import matplotlib.pyplot as plt  # Thêm matplotlib để vẽ biểu đồ


def find_peak_trading_hour(timestamps):
    # Chuyển đổi timestamp thành giờ và đếm tần suất
    hours = [datetime.fromtimestamp(ts).hour for ts in timestamps]
    hour_frequency = Counter(hours)

    # Tìm giờ có tần suất cao nhất
    peak_hour, max_frequency = max(hour_frequency.items(), key=lambda x: x[1])
    return peak_hour, max_frequency, hour_frequency


def find_peak_trading_half_hour(timestamps):
    # Chuyển đổi timestamp thành khoảng thời gian 0.5 giờ và đếm tần suất
    half_hours = [(datetime.fromtimestamp(ts).hour * 2 +
                   datetime.fromtimestamp(ts).minute // 30) for ts in timestamps]
    half_hour_frequency = Counter(half_hours)

    # Tìm khoảng thời gian 0.5 giờ có tần suất cao nhất
    peak_half_hour, max_frequency = max(
        half_hour_frequency.items(), key=lambda x: x[1])
    return peak_half_hour, max_frequency, half_hour_frequency


def get_datasets():
    file_path = os.path.join(os.path.dirname(
        __file__), "../../backupData/datasets.json")
    with open(file_path, "r", encoding="utf-8") as file:
        datasets = json.load(file)
    return datasets


# Lấy dữ liệu từ datasets
datasets = get_datasets()
timestamps = [dataset.get("bidTime", dataset.get("listTime"))
              for dataset in datasets if "bidTime" in dataset or "listTime" in dataset]

# Tìm khoảng thời gian giao dịch cao điểm và hiển thị bảng tần suất
peak_half_hour, max_frequency, half_hour_frequency = find_peak_trading_half_hour(
    timestamps)

# Tính tổng lượng giao dịch
total_transactions = sum(list(half_hour_frequency.values()))

# Lấy thời gian hiện tại
current_time = datetime.now()
current_half_hour = current_time.hour * 2 + current_time.minute // 30

# Vẽ biểu đồ
colors = ['skyblue' if hh != current_half_hour else 'orange' for hh in sorted(
    half_hour_frequency.keys())]
half_hour_labels = [
    f"{hh // 2}:{(hh % 2) * 30:02d}" for hh in sorted(half_hour_frequency.keys())]
frequencies = [half_hour_frequency[hh]
               for hh in sorted(half_hour_frequency.keys())]

plt.bar(half_hour_labels, frequencies, color=colors)
plt.xlabel('Thời gian (0.5 giờ)')
plt.ylabel('Tần suất giao dịch')
plt.title(
    f'Biểu đồ tần suất giao dịch theo 0.5 giờ (Tổng: {total_transactions})')
plt.xticks(rotation=90)  # Xoay nhãn trục x để dễ đọc
plt.grid(axis='y', linestyle='--', alpha=0.7)
plt.tight_layout()  # Đảm bảo bố cục không bị cắt
plt.show()
