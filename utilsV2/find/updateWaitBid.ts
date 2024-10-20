import { BidAuction } from "../../types/bid/BidAuction";

const fs = require("fs");
export const updateWaitBid = async (profitableAuctions: BidAuction[]) => {
    let waitBid = JSON.parse(fs.readFileSync("waitBid.json", "utf8")).data;
    if (!waitBid) {
        waitBid = [];
    }
    waitBid.push(...profitableAuctions);
    await fs.writeFileSync("waitBid.json", JSON.stringify({ data: waitBid }));
};
