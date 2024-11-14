import fs from "fs";
import { BidAuction } from "../../types/bid/BidAuction";

export const getBidAuctions = async (): Promise<BidAuction[]> => {
    try {
        const bidAuctions = JSON.parse(fs.readFileSync("waitBid.json", "utf8")).data;
        return bidAuctions;
    } catch (error) {
        return [];
    }
};

export const saveBidAuctions = async (bidAuctions: BidAuction[]) => {
    if (!bidAuctions) {
        return;
    }
    try {
        fs.writeFileSync("waitBid.json", JSON.stringify({ data: bidAuctions }));
    } catch (error) {
        console.error("Error saving bid auctions:", error);
    }
};
