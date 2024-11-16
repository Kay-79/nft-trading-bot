import { MP_ADDRESS, NORMAL_BUYER_MAINNET, RATE_FEE_MARKET } from "../../constants/constants";
import { AuctionType } from "../../enum/enum";
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
    getProfitableBidAuctionsNormalVsPro,
    isProfitable
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
        ...getProfitableBidAuctionsNormalVsPro(
            normalAuctions,
            priceMins,
            bnbPrice,
            AuctionType.NORMAL
        )
    );
    profitableBidAuctions.push(
        ...getProfitableBidAuctionsNormalVsPro(proAuctions, priceMins, bnbPrice, AuctionType.PRO)
    );
    for (let i = 0; i < bundleAuctions.length; i++) {
        const auction = bundleAuctions[i];
        let profit = 0;
        let minProfit = 0;
        let minValueAuction = 0;
        if (auction?.ids === undefined || auction?.amounts === undefined) {
            continue;
        }
        let amount = 0;
        for (let j = 0; j < (auction?.ids ?? []).length; j++) {
            const minValueType = getMinValueType(
                auction?.ids[j],
                Number(auction?.amounts[j]),
                priceMins
            );
            minValueAuction += minValueType[0];
            minProfit += minValueType[1];
            amount += Number(auction?.amounts[j]);
        }
        if (auction?.nowPrice === undefined) {
            continue;
        }
        profit =
            minValueAuction * (1 - RATE_FEE_MARKET) -
            feeBundle(bnbPrice) -
            auction?.nowPrice * 10 ** -9;
        if (isProfitable(profit, minProfit)) {
            profitableBidAuctions.push(
                setupBidAuction(
                    [auction],
                    profit,
                    minProfit,
                    priceMins,
                    bnbPrice,
                    feeBundle(bnbPrice),
                    AuctionType.BUNDLE,
                    amount,
                    auction?.nowPrice
                )
            );
        }
    }
    return profitableBidAuctions;
};
