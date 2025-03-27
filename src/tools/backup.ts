import { connectMongo } from "@/utils/connectMongo";
import fs from "fs";

const backupDatabase = async () => {
    const db = await connectMongo();
    const allCollections = await db.listCollections().toArray();
    const collections = allCollections.map(collection => collection.name);
    const backupDir = "backupData";
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
    }
    for (const collection of collections) {
        const data = await db.collection(collection).find().toArray();
        const backupPath = `${backupDir}/${collection}.json`;
        fs.writeFileSync(backupPath, JSON.stringify(data, null, 4));
        console.log(`Backup for collection ${collection} saved to ${backupPath}`);
    }
    console.log("Backup completed!");
};

backupDatabase()
    .then(() => process.exit(0))
    .catch(error => {
        console.error("Backup failed:", error);
        process.exit(1);
    });
