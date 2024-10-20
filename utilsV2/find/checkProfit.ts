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

export const checkProfit = (
    auctions: AuctionDto[],
    priceMins: TierPrice,
    bnbPrice: number
): BidAuction[] => {
    let profitableAuctions: BidAuction[] = [];
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
        profit = minValueAuction * 0.95 - feeBundle(bnbPrice) - auction?.nowPrice * 10 ** -9;
        if (true || profit >= minProfit) {
            profitableAuctions.push({
                id: auction?.id,
                uptime: auction?.uptime,
                profit: profit,
                minProfit: minProfit,
                buyer: "mock",
                contractAddress: "mock",
                nowPrice: auction?.nowPrice,
                isBatch: false,
                minPrice: priceMins,
                auctions: [auction]
            });
        }
    }
    return profitableAuctions;
};
