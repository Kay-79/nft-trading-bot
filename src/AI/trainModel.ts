import * as tf from "@tensorflow/tfjs";

// Hàm tạo model
function createModel(): tf.Sequential {
    const model = tf.sequential();
    // Layer ẩn
    model.add(tf.layers.dense({ units: 64, activation: "relu", inputShape: [4] })); // 4 input features
    // Layer output
    model.add(tf.layers.dense({ units: 1 })); // Output là giá trị giá trị dự đoán (bidPrice)
    // Compile model
    model.compile({ optimizer: "adam", loss: "meanSquaredError" });
    console.log("Model initialized.");
    return model;
}

// Hàm train model với dữ liệu ban đầu
async function trainModel(model: tf.Sequential, data: any[]) {
    const xs = tf.tensor2d(data.map(d => [d.level, d.hashrate, d.lvHashrate, d.quality])); // 4 features
    const ys = tf.tensor2d(data.map(d => [d.bidPrice])); // Giá trị mục tiêu (bidPrice)

    console.log("Training model with initial data...");
    await model.fit(xs, ys, { epochs: 10 });
    console.log("Initial training complete.");
}

// Hàm train incremental learning
async function incrementalLearning(model: tf.Sequential, newData: any[]) {
    const xs = tf.tensor2d(newData.map(d => [d.level, d.hashrate, d.lvHashrate, d.quality])); // 4 features
    const ys = tf.tensor2d(newData.map(d => [d.bidPrice])); // Giá trị mục tiêu (bidPrice)

    console.log("Fine-tuning model with new data...");
    await model.fit(xs, ys, { epochs: 5 });
    console.log("Incremental training complete.");
}

// Hàm lưu mô hình
async function saveModel(model: tf.Sequential, path: string) {
    await model.save(`file://${path}`);
    console.log(`Model saved at ${path}`);
}

// Hàm load mô hình
async function loadModel(path: string): Promise<tf.Sequential | null> {
    try {
        const model = await tf.loadLayersModel(`file://${path}/model.json`);
        console.log("Model loaded successfully.");
        return model as tf.Sequential;
    } catch (error) {
        console.error("Failed to load model:", error);
        return null;
    }
}

// Dữ liệu mẫu ban đầu
const initialData = [
    { level: 1, hashrate: 100, lvHashrate: 150, quality: 1, bidPrice: 10 },
    { level: 2, hashrate: 200, lvHashrate: 300, quality: 1, bidPrice: 20 },
    { level: 3, hashrate: 300, lvHashrate: 450, quality: 2, bidPrice: 30 },
    { level: 4, hashrate: 400, lvHashrate: 600, quality: 2, bidPrice: 40 }
];

// Dữ liệu mới để incremental learning
const newData = [
    { level: 5, hashrate: 500, lvHashrate: 750, quality: 3, bidPrice: 50 },
    { level: 6, hashrate: 600, lvHashrate: 900, quality: 3, bidPrice: 60 }
];

// Main function
(async () => {
    const modelPath = "./model";
    let model: tf.Sequential | null = await loadModel(modelPath);

    if (!model) {
        // Tạo model mới nếu không có mô hình lưu trước đó
        model = createModel();
        // Train với dữ liệu ban đầu
        await trainModel(model, initialData);
        // Lưu mô hình sau khi train
        await saveModel(model, modelPath);
    }

    // Incremental learning với dữ liệu mới
    await incrementalLearning(model, newData);
    // Lưu mô hình sau khi fine-tune
    await saveModel(model, modelPath);
})();
