// process.on("unhandledRejection", (reason, promise) => {});
import { getNewAutions } from "../utilsV2/find/getNewAuctions";
import { ranSleep } from "../utilsV2/common/sleep";
import { AuctionDto } from "../types/dtos/Auction.dto";
import { checkProfit } from "../utilsV2/find/checkProfit";

let cacheIds: string[] = [];

const findV2 = async () => {
    while (true) {
        let newAuctions: AuctionDto[] = [];
        await getNewAutions(cacheIds).then(async ([auctions, ids]) => {
            newAuctions = auctions;
            cacheIds = ids;
        });

        checkProfit(newAuctions);

        await ranSleep(20, 30);
    }
};
