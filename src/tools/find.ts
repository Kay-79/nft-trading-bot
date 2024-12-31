process.on("unhandledRejection", (reason, promise) => {
    console.log("Custom Unhandled Rejection at:", promise, "reason:", reason);
});
import { getNewAutions } from "../utilsV2/find/getNewAuctions";
import { ranSleep } from "../utilsV2/common/sleep";
import { AuctionDto } from "../types/dtos/Auction.dto";
import { checkProfit } from "../utilsV2/find/checkProfit";
import { updateWaitBid } from "../utilsV2/find/utils";
import {
    CACHE_BNB_PRICE,
    CACHE_TIER_PRICE,
    ENV,
    TIME_DELAY_NOTICE_STATUS_BOT,
    TIME_DELAY_SETUP_FIND
} from "../constants/constants";
import { setup } from "../utilsV2/find/setup";
import { SetupFind } from "../types/find/SetupFind";
import { noticeBotFind } from "../utilsV2/bid/handleNoticeBot";

const findV2 = async () => {
    console.log("Starting findV2...", ENV);
    let latestNotice = new Date().getHours() - TIME_DELAY_NOTICE_STATUS_BOT;
    let cacheIds: string[] = [];
    let initSetup: SetupFind = await setup(CACHE_BNB_PRICE, CACHE_TIER_PRICE);
    let {
        bnbPrice,
        isFrontRunNormal,
        isFrontRunPro,
        isFrontRunProHash,
        floorPrices,
        timeLastSetup
    } = initSetup;
    while (true) {
        const now = new Date();
        const currentHour = now.getHours();
        if (Math.abs(currentHour - latestNotice) >= TIME_DELAY_NOTICE_STATUS_BOT) {
            latestNotice = await noticeBotFind(
                latestNotice,
                floorPrices || CACHE_TIER_PRICE,
                bnbPrice || CACHE_BNB_PRICE
            );
        }
        let newAuctions: AuctionDto[] = [];
        await getNewAutions(cacheIds).then(async ([auctions, ids]) => {
            newAuctions = auctions;
            cacheIds = ids;
        });

        if (
            !bnbPrice ||
            !isFrontRunNormal ||
            !isFrontRunPro ||
            !isFrontRunProHash ||
            !floorPrices ||
            !timeLastSetup
        )
            continue;
        const isHasProfit = (await checkProfit(newAuctions, floorPrices, bnbPrice)).length > 0;
        isHasProfit ? updateWaitBid(await checkProfit(newAuctions, floorPrices, bnbPrice)) : {};
        if (Date.now() / 1000 - timeLastSetup > TIME_DELAY_SETUP_FIND) {
            initSetup = await setup(bnbPrice, floorPrices);
            ({
                bnbPrice,
                isFrontRunNormal,
                isFrontRunPro,
                isFrontRunProHash,
                floorPrices,
                timeLastSetup
            } = initSetup);
        }
        await ranSleep(20, 30);
    }
};

findV2();
