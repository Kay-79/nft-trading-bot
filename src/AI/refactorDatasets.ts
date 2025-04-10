import fs from "fs";

const refactorDatasets = async () => {
    const filePath = "./backupData/datasets.json";
    let existingData = [];
    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        existingData = fileContent.trim() ? JSON.parse(fileContent) : [];
    }

    for (let i = 0; i < existingData.length; i++) {
        const dataset = existingData[i];
        const momoEquipments = dataset.momoEquipment;
        for (let j = 0; j < momoEquipments.length; j++) {
            if (momoEquipments[j] > 0) {
                momoEquipments[j] = momoEquipments[j] - (j + 1) * 100;
            } else {
                momoEquipments[j] = 0;
            }
        }
    }

    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
};

refactorDatasets();
