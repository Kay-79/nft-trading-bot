// process.on("unhandledRejection", (reason, promise) => {});
import axios from "axios";
import { config } from "../config/config";
import { getNewAutions } from "../utilsV2/find/getNewAuctions";
import { ranSleep } from "../utilsV2/common/sleep";
import { AuctionDto } from "../types/dtos/Auction.dto";

let cacheIds: string[] = [];

const findV2 = async () => {
    while (true) {
        let newAuctions: AuctionDto[] = [];
        await getNewAutions(cacheIds).then(async ([auctions, ids]) => {
            newAuctions = auctions;
            cacheIds = ids;
        });
        
        await ranSleep(30, 60);
    }
};
