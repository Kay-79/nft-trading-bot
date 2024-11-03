import { BidAuction } from "../types/bid/BidAuction";
import fs from "fs";
import { ranSleep, sleep } from "../utilsV2/common/sleep";
import { bidAuction } from "../utilsV2/bid/bidAuction";
import { IS_FRONT_RUNNING } from "../config/constans";
import { frontRunBidAuction } from "../utilsV2/bid/frontRunBidAuction";
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
            sleep(5);
            continue;
        }
        bidAuctions.sort((a, b) => (a.uptime ?? 0) - (b.uptime ?? 0));
        const currentBidAuction: BidAuction | undefined = bidAuctions.shift();
        if (!currentBidAuction) {
            continue;
        }
        fs.writeFileSync("waitBid.json", JSON.stringify({ data: bidAuctions }));
        if (IS_FRONT_RUNNING) {
            await frontRunBidAuction(currentBidAuction); // Comming soon
        } else await bidAuction(currentBidAuction);
    }
};

bidV2();
function exit() {
    throw new Error("Processing exit");
}
