// process.on("unhandledRejection", (reason, promise) => {});
import { getNewAutions } from "../utilsV2/find/getNewAuctions";
import { ranSleep } from "../utilsV2/common/sleep";
import { AuctionDto } from "../types/dtos/Auction.dto";
import { checkProfit } from "../utilsV2/find/checkProfit";
import { TierPrice } from "../types/dtos/TierPrice.dto";
import { getBnbPrice, updateWaitBid } from "../utilsV2/find/utils";
import { CACHE_BNB_PRICE, TIME_DELAY_SETUP_FIND } from "../config/constans";

const findV2 = async () => {
    console.log("Starting findV2...");
    let cacheIds: string[] = [];
    let bnbPrice = await getBnbPrice(CACHE_BNB_PRICE);
    let delaySetup = Date.now() / 1000;
    exit();
    while (true) {
        let newAuctions: AuctionDto[] = [];
        await getNewAutions(cacheIds).then(async ([auctions, ids]) => {
            newAuctions = auctions;
            cacheIds = ids;
        });
        const isHasProfit = checkProfit(newAuctions, examplePriceMins, bnbPrice).length > 0;
        isHasProfit ? updateWaitBid(checkProfit(newAuctions, examplePriceMins, bnbPrice)) : {};
        exit();
        if (Date.now() / 1000 - delaySetup > TIME_DELAY_SETUP_FIND) {
            bnbPrice = await getBnbPrice(bnbPrice);
            delaySetup = Date.now() / 1000;
        }
        await ranSleep(20, 30);
    }
};

const examplePriceMins: TierPrice = {
    1: 1.45,
    2: 0.82,
    3: 0.65,
    4: 8,
    5: 40,
    6: 4111
};

const exampleBnbPrice = 600;
findV2();
function exit() {
    throw new Error("Processing exit");
}
