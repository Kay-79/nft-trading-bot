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
import { delayTimeGet, modeBot } from "config/config";
import { checkProfitAuctionGroups } from "utilsV2/find/checkProfitAuctionGroups";
import { LatestGet } from "types/find/LatestGet";

const findV2 = async () => {
    console.log("Starting findV2...", ENV);
    let latestNotice = new Date().getHours() - TIME_DELAY_NOTICE_STATUS_BOT;
    let latestGetData: LatestGet = {
        auction: 0,
        auctionGroup: 0,
        box: 0,
        mexBox: 0,
        gem: 0
    };
    let cacheIds: CacheFind = {
        auction: [],
        auctionGroup: [],
        box: [],
        mexBox: [],
        gem: []
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
        if (
            (modeBot.auction?.normal || modeBot.auction?.pro || modeBot.auction?.bundle) &&
            Date.now() / 1000 - (latestGetData.auction ?? 0) > (delayTimeGet.auction ?? 0)
        ) {
            latestGetData.auction = Date.now() / 1000;
            await getNewAutions(cacheIds.auction || []).then(async ([auctions, auctionIds]) => {
                newAuctions = auctions;
                cacheIds.auction = auctionIds;
            });
            const profitAuctions = await checkProfitAuctions(newAuctions, floorPrices, bnbPrice);
            if (profitAuctions.length > 0) {
                await updateWaitBid(profitAuctions);
            }
        }
        await ranSleep(3, 7);
        if (
            (modeBot.auctionGroup?.bep721 || modeBot.auctionGroup?.crew) &&
            Date.now() / 1000 - (latestGetData.auctionGroup ?? 0) > (delayTimeGet.auctionGroup ?? 0)
        ) {
            latestGetData.auctionGroup = Date.now() / 1000;
            await getNewAuctionGroups(cacheIds.auctionGroup || []).then(
                async ([auctionGroups, auctionGroupIds]) => {
                    newAuctionsBlock = auctionGroups;
                    cacheIds.auctionGroup = auctionGroupIds;
                }
            );
            const profitAuctionsBlock = await checkProfitAuctionGroups(
                newAuctionsBlock,
                floorPrices,
                bnbPrice
            );
            if (profitAuctionsBlock.length > 0) {
                await updateWaitBid(profitAuctionsBlock);
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
