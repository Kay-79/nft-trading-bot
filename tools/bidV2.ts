import { BidAuction } from "../types/bid/BidAuction";
import fs from "fs";
import { ranSleep } from "../utilsV2/common/sleep";
const bidV2 = async () => {
    while (true) {
        let bidAuctions: BidAuction[] = [];
        try {
            bidAuctions = JSON.parse(fs.readFileSync("waitBid.json", "utf8")).data;
        } catch (error) {
            bidAuctions = [];
        }
        if (!bidAuctions) {
            bidAuctions = [];
        }
        if (bidAuctions.length == 0) {
            ranSleep(5, 10);
            continue;
        }
        bidAuctions.sort((a, b) => (a.uptime ?? 0) - (b.uptime ?? 0));
        const bidAuction: BidAuction | undefined = bidAuctions.shift();
        if (!bidAuction) {
            continue;
        }
        fs.writeFileSync("waitBid.json", JSON.stringify({ data: bidAuctions }));
        exit();
    }
};

bidV2();
function exit() {
    throw new Error("Processing exit");
}
