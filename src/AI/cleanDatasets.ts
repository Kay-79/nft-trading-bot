import fs from "fs";
import { newbieBidders, proBidders, newbieAucthors } from "@/config/config";
import { ethers } from "ethers";

export const cleanDatasets = async () => {
    const filePath = "./src/AI/data/moboxDatasets.json";
    let existingData = [];
    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        existingData = fileContent.trim() ? JSON.parse(fileContent) : [];
    }
    const proTradersNormalized = new Set(proBidders.map(addr => ethers.getAddress(addr)));
    const newbieTradersNormalized = new Set(newbieBidders.map(addr => ethers.getAddress(addr)));
    const newbieAuctorsNormalized = new Set(newbieAucthors.map(addr => ethers.getAddress(addr)));
    const newData = existingData.filter(
        (dataset: {
            bidder: string;
            auctor: string;
            output: number[];
            bidTime: number;
            listTime: number;
        }) => {
            const bidderAddress = ethers.getAddress(dataset.bidder.trim()); // Chuẩn hóa bidder address
            const auctorAddress = ethers.getAddress(dataset.auctor.trim()); // Chuẩn hóa aucthor address
            const isNotnewbieAuctor = !newbieAuctorsNormalized.has(auctorAddress);
            const isNotProTrader = !proTradersNormalized.has(bidderAddress);
            const isNotnewbieTrader = !newbieTradersNormalized.has(bidderAddress);
            return (
                dataset.output.length === 1 &&
                isNotProTrader &&
                isNotnewbieTrader &&
                isNotnewbieAuctor &&
                dataset.bidTime - dataset.listTime > 5 * 60
            );
        }
    );
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
};

cleanDatasets();
