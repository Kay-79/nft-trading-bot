import { BidAuction } from "../types/bid/BidAuction";
import { ranSleep, sleep } from "../utilsV2/common/sleep";
import { bidAuction } from "../utilsV2/bid/bidAuction";
import { IS_FRONT_RUNNING } from "../constants/constants";
import { frontRunBidAuction } from "../utilsV2/bid/frontRunBidAuction";
import { getBidAuctions, saveBidAuctions } from "../utilsV2/bid/utils";

const bidV2 = async () => {
    console.log("Start bidV2");
    while (true) {
        let bidAuctions: BidAuction[] = [];
        try {
            bidAuctions = await getBidAuctions();
        } catch (error) {
            bidAuctions = [];
        }
        if (!bidAuctions) {
            bidAuctions = [];
        }
        bidAuctions.sort((a, b) => (a.uptime ?? 0) - (b.uptime ?? 0));
        const currentBidAuction: BidAuction | undefined = bidAuctions.shift();
        if (!currentBidAuction) {
            console.log("No bid auction found");
            await sleep(5);
            continue;
        }
        try {
            await saveBidAuctions(bidAuctions);
        } catch (error) {
            console.error("Error saving bid auctions:", error);
        }
        if (IS_FRONT_RUNNING) {
            await frontRunBidAuction(currentBidAuction); // Comming soon
        } else {
            await bidAuction(currentBidAuction);
            console.log("Bid done");
        }
        console.log("Testing...");
        await ranSleep(5, 6);
    }
};

bidV2();
function exit() {
    throw new Error("Processing exit");
}
