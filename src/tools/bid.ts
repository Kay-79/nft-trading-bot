import { BidAuction } from "../types/bid/BidAuction";
import { ranSleep } from "../utilsV2/common/sleep";
import { normalBidAuction } from "../utilsV2/bid/normalBidAuction";
import { ENV, IS_FRONT_RUNNING, TIME_DELAY_NOTICE_STATUS_BOT } from "../constants/constants";
import { frontRunBidAuction } from "../utilsV2/bid/frontRunBidAuction";
import { getBidAuctions, saveBidAuctions } from "../utilsV2/bid/utils";
import { noticeBotBid, noticeErrorBid } from "../utilsV2/bid/handleNoticeBot";

const bidV2 = async () => {
    console.log("Starting bidV2...", ENV);
    let latestNotice = new Date().getHours();
    latestNotice = await noticeBotBid(latestNotice);
    while (true) {
        const now = new Date();
        const currentHour = now.getHours();
        if (Math.abs(currentHour - latestNotice) >= TIME_DELAY_NOTICE_STATUS_BOT) {
            console.log("Notice bot bid");
            latestNotice = await noticeBotBid(latestNotice);
        }
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
            try {
                await frontRunBidAuction(sameUpTimeAuctions); // Comming soon
            } catch (error) {}
        } else {
            try {
                await normalBidAuction(sameUpTimeAuctions);
            } catch (error) {}
        }
        await ranSleep(5, 6);
    }
};

bidV2();
