import { BidAuction } from "../types/bid/BidAuction";
import { ranSleep } from "../utilsV2/common/sleep";
import { normalBidAuction } from "../utilsV2/bid/normalBidAuction";
import { IS_FRONT_RUNNING } from "../constants/constants";
import { frontRunBidAuction } from "../utilsV2/bid/frontRunBidAuction";
import { getBidAuctions, saveBidAuctions } from "../utilsV2/bid/utils";
import { noticeBotBid } from "../utilsV2/bid/handleNoticeBot";

const bidV2 = async () => {
    console.log("Starting bidV2...");
    let latestNotice = 0;
    latestNotice = await noticeBotBid(latestNotice);
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
        const uptime = bidAuctions[0]?.uptime;
        const sameUpTimeAuctions = bidAuctions.filter(item => item.uptime === uptime);
        bidAuctions = bidAuctions.filter(item => item.uptime !== uptime);

        if (!sameUpTimeAuctions || sameUpTimeAuctions.length === 0) {
            await ranSleep(5, 6);
            continue;
        }
        try {
            await saveBidAuctions(bidAuctions);
        } catch (error) {
            console.error("Error saving bid auctions:", error);
        }
        if (IS_FRONT_RUNNING) {
            await frontRunBidAuction(sameUpTimeAuctions); // Comming soon
        } else {
            await normalBidAuction(sameUpTimeAuctions);
            console.log("Bid done");
        }
        const now = new Date();
        const currentHour = now.getHours();
        if (Math.abs(currentHour - latestNotice) >= 4) {
            console.log("Notice bot bid");
            latestNotice = await noticeBotBid(latestNotice);
        }
        await ranSleep(5, 6);
    }
};

bidV2();
