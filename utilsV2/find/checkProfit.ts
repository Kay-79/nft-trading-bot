import { BidAuction } from "../../types/bid/BidAuction";
import { AuctionDto } from "../../types/dtos/Auction.dto";
import { TierPrice } from "../../types/dtos/TierPrice.dto";
import {
    isBundleAuction,
    isProAuction,
    isNormalAuction,
    getMinValueType,
    feeBundle
} from "./utils";
import fs from "fs";

export const checkProfit = (
    auctions: AuctionDto[],
    priceMins: TierPrice,
    bnbPrice: number
): BidAuction[] => {
    let normalAuctions: AuctionDto[] = [];
    let proAuctions: AuctionDto[] = [];
    let bundleAuctions: AuctionDto[] = [];
    for (let i = 0; i < auctions.length; i++) {
        const auction = auctions[i];
        if (isProAuction(auction)) {
            proAuctions.push(auction);
        } else if (isBundleAuction(auction)) {
            bundleAuctions.push(auction);
        } else {
            normalAuctions.push(auction);
        }
    }
    for (let i = 0; i < normalAuctions.length; i++) {
        const auction = normalAuctions[i];
        switch (auction?.prototype) {
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
        }
    }
    for (let i = 0; i < proAuctions.length; i++) {
        const auction = proAuctions[i];
    }
    for (let i = 0; i < bundleAuctions.length; i++) {
        const auction = bundleAuctions[i];
        let profit = 0;
        let minProfit = 0;
        let minValueAuction = 0;
        for (let j = 0; j < (auction?.ids ?? []).length; j++) {
            if (auction?.ids === undefined || auction?.amounts === undefined) {
                continue;
            }
            minValueAuction += getMinValueType(
                auction?.ids[j],
                Number(auction?.amounts[j]),
                priceMins
            )[0];
            minProfit += getMinValueType(
                auction?.ids[j],
                Number(auction?.amounts[j]),
                priceMins
            )[1];
        }
        if (auction?.nowPrice === undefined) {
            continue;
        }
        console.log(minValueAuction);
        profit = minValueAuction * 0.95 - feeBundle(bnbPrice) - auction?.nowPrice * 10 ** -9;
        console.log("pricePack", auction?.nowPrice * 10 ** -9);
        console.log("fee", feeBundle(bnbPrice));
        console.log("profit", profit);
        console.log("minProfit", minProfit);
    }
    return [];
};

const exampleAuctionBundle = [
    {
        id: "bnb_0xC0DC6D8c154e55c4326C4436f14e97989BB6B152_0",
        chain: "bnb",
        auctor: "0xC0DC6D8c154e55c4326C4436f14e97989BB6B152",
        startPrice: 11000000000,
        endPrice: 11450000000,
        durationDays: 2,
        index: 0,
        ids: ["34039", "34016", "31017", "33052", "23052", "13052"],
        amounts: ["1", "1", "1", "1", "1", "1"],
        tokenId: 0,
        uptime: 1728587071,
        prototype: 34039,
        hashrate: 3,
        lvHashrate: 3,
        level: 1,
        specialty: 0,
        category: 0,
        quality: 0,
        tx: "0x402a863d0d59687159bc451c8f1379179aec49e74b7711db349fcd0e44eeacb7",
        deleted: null,
        nowPrice: 11000000000
    }
];

const examplePriceMins: TierPrice = {
    1: 1.5,
    2: 0.82,
    3: 0.58,
    4: 8,
    5: 40,
    6: 4111
};
const exampleBnbPrice = 600;

checkProfit(exampleAuctionBundle, examplePriceMins, exampleBnbPrice);
