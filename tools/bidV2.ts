import { BidAuction } from "../types/bid/BidAuction";
import { ranSleep, sleep } from "../utilsV2/common/sleep";
import { bidAuction } from "../utilsV2/bid/bidAuction";
import { IS_FRONT_RUNNING } from "../config/constans";
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
        }
        console.log("Testing...");
        await ranSleep(5, 6);
    }
};

bidV2();
<<<<<<< HEAD
=======
function exit() {
    throw new Error("Processing exit");
}
>>>>>>> e12ec24c32a66d04d80a958a72dc86c31aec40a6
