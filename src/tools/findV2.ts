process.on("unhandledRejection", (reason, promise) => {
    console.log("Unhandled Rejection at:", promise, "reason:", reason);
});
import { getNewAutions } from "../utilsV2/find/getNewAuctions";
import { ranSleep } from "../utilsV2/common/sleep";
import { AuctionDto } from "../types/dtos/Auction.dto";
import { checkProfit } from "../utilsV2/find/checkProfit";
import { updateWaitBid } from "../utilsV2/find/utils";
import { CACHE_BNB_PRICE, TIME_DELAY_SETUP_FIND } from "../constants/constants";
import { setup } from "../utilsV2/find/setup";
import { SetupFind } from "../types/find/SetupFind";
import { noticeBotFind } from "../utilsV2/bid/handleNoticeBot";

const findV2 = async () => {
    console.log("Starting findV2...");
    let cacheIds: string[] = [];
    let initSetup: SetupFind = await setup(CACHE_BNB_PRICE);
    let { bnbPrice, isFrontRunNormal, isFrontRunPro, isFrontRunProHash, priceMins, timeLastSetup } =
        initSetup;
    let latestNotice = await noticeBotFind();
    while (true) {
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
            !priceMins ||
            !timeLastSetup
        )
            continue;
        const isHasProfit = checkProfit(newAuctions, priceMins, bnbPrice).length > 0;
        isHasProfit ? updateWaitBid(checkProfit(newAuctions, priceMins, bnbPrice)) : {};
        if (Date.now() / 1000 - timeLastSetup > TIME_DELAY_SETUP_FIND) {
            initSetup = await setup(bnbPrice);
            ({
                bnbPrice,
                isFrontRunNormal,
                isFrontRunPro,
                isFrontRunProHash,
                priceMins,
                timeLastSetup
            } = initSetup);
        }
        const now = new Date();
        const currentHour = now.getHours();
        if (Math.abs(currentHour - latestNotice) >= 4) {
            latestNotice = await noticeBotFind();
        }
        await ranSleep(20, 30);
    }
};

findV2();
