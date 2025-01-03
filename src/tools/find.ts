process.on("unhandledRejection", (reason, promise) => {
    console.log("Custom Unhandled Rejection at:", promise, "reason:", reason);
});
import { getNewAutions } from "../utilsV2/find/getNewAuctions";
import { ranSleep } from "../utilsV2/common/sleep";
import { AuctionDto } from "../types/dtos/Auction.dto";
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
import { checkProfitAuctions } from "utilsV2/find/checkProfitAuctions";
import { CacheFind } from "types/find/CacheFind";
import { AuctionGroupDto } from "types/dtos/AuctionGroup.dto";
import { getNewAuctionGroups } from "utilsV2/find/getNewAuctionGroups";
import { modeBot } from "config/config";
import { checkProfitAuctionGroups } from "utilsV2/find/checkProfitAuctionGroups";

const findV2 = async () => {
    console.log("Starting findV2...", ENV);
    let latestNotice = new Date().getHours() - TIME_DELAY_NOTICE_STATUS_BOT;
    let cacheIds: CacheFind = {
        momo: [],
        momoBlock: [],
        Box: [],
        MexBox: []
    };
    let initSetup: SetupFind = await setup(CACHE_BNB_PRICE, CACHE_TIER_PRICE);
    let {
        bnbPrice,
        isFrontRunNormal,
        isFrontRunPro,
        isFrontRunProHash,
        floorPrices,
        timeLastSetup
    } = initSetup;
    console.log(`Mode Bot\nAuction: ${modeBot.auction}\nGroup:${modeBot.auctionGroup}`);
    while (true) {
        //===========================SETUP===========================
        if (
            !bnbPrice ||
            !isFrontRunNormal ||
            !isFrontRunPro ||
            !isFrontRunProHash ||
            !floorPrices ||
            !timeLastSetup
        )
            continue;
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
        let newAuctionsBlock: AuctionGroupDto[] = [];
        //===========================AUCTION===========================
        if (modeBot.auction) {
            await getNewAutions(cacheIds.momo || []).then(async ([auctions, auctionIds]) => {
                newAuctions = auctions;
                cacheIds.momo = auctionIds;
            });
            const profitAuctions = await checkProfitAuctions(newAuctions, floorPrices, bnbPrice);
            if (profitAuctions.length > 0) {
                updateWaitBid(profitAuctions);
            }
        }
        if (modeBot.auctionGroup) {
            await getNewAuctionGroups(cacheIds.momoBlock || []).then(
                async ([auctionGroups, auctionGroupIds]) => {
                    newAuctionsBlock = auctionGroups;
                    cacheIds.momoBlock = auctionGroupIds;
                }
            );
            const profitAuctionsBlock = await checkProfitAuctionGroups(
                newAuctionsBlock,
                floorPrices,
                bnbPrice
            );
            if (profitAuctionsBlock.length > 0) {
                updateWaitBid(profitAuctionsBlock);
            }
        }
        //===========================SETUP===========================
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
        await ranSleep(15, 30);
    }
};

findV2();
