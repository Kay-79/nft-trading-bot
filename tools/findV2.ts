// process.on("unhandledRejection", (reason, promise) => {});
import { getNewAutions } from "../utilsV2/find/getNewAuctions";
import { ranSleep } from "../utilsV2/common/sleep";
import { AuctionDto } from "../types/dtos/Auction.dto";
import { checkProfit } from "../utilsV2/find/checkProfit";
import { TierPrice } from "../types/dtos/TierPrice.dto";
import { getBnbPrice, updateWaitBid } from "../utilsV2/find/utils";
import { CACHE_BNB_PRICE, TIME_DELAY_SETUP_FIND } from "../config/constans";
import { setup } from "../utilsV2/find/setup";
import { SetupFind } from "../types/find/SetupFind";

const findV2 = async () => {
    console.log("Starting findV2...");
    let cacheIds: string[] = [];
    let initSetup: SetupFind = await setup(CACHE_BNB_PRICE);
    let { bnbPrice, isFrontRunNormal, isFrontRunPro, isFrontRunProHash, priceMins, timeLastSetup } =
        initSetup;
    while (true) {
        let newAuctions: AuctionDto[] = [];
        await getNewAutions(cacheIds).then(async ([auctions, ids]) => {
            newAuctions = auctions;
            cacheIds = ids;
        });
        if (bnbPrice === undefined || priceMins === undefined || timeLastSetup === undefined)
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
        await ranSleep(20, 30);
    }
};

findV2();
function exit() {
    throw new Error("Processing exit");
}
