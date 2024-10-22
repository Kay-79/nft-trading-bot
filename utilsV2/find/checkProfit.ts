import { MP_ADDRESS, NORMAL_BUYER } from "../../config/constans";
import { AuctionType } from "../../config/enum";
import { BidAuction } from "../../types/bid/BidAuction";
import { AuctionDto } from "../../types/dtos/Auction.dto";
import { TierPrice } from "../../types/dtos/TierPrice.dto";
import {
    isBundleAuction,
    isProAuction,
    isNormalAuction,
    getMinValueType,
    feeBundle,
    setupBidAuction,
    getMinValueTypePro,
    feePro,
    getProfitableBidAuctionsNormal,
    getProfitableBidAuctionsPro
} from "./utils";

export const checkProfit = (
    auctions: AuctionDto[],
    priceMins: TierPrice,
    bnbPrice: number
): BidAuction[] => {
    if (!auctions || auctions.length == 0) {
        return [];
    }
    let profitableBidAuctions: BidAuction[] = [];
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
    profitableBidAuctions.push(
        ...getProfitableBidAuctionsNormal(normalAuctions, priceMins, bnbPrice)
    );
    profitableBidAuctions.push(...getProfitableBidAuctionsPro(proAuctions, priceMins, bnbPrice));
    for (let i = 0; i < bundleAuctions.length; i++) {
        const auction = bundleAuctions[i];
        let profit = 0;
        let minProfit = 0;
        let minValueAuction = 0;
        if (auction?.ids === undefined || auction?.amounts === undefined) {
            continue;
        }
        for (let j = 0; j < (auction?.ids ?? []).length; j++) {
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
        if (profit > minProfit) {
            profitableBidAuctions.push(
                setupBidAuction(
                    [auction],
                    profit,
                    minProfit,
                    priceMins,
                    bnbPrice,
                    feeBundle(bnbPrice),
                    AuctionType.BUNDLE
                )
            );
        }
    }
    return profitableBidAuctions;
};
