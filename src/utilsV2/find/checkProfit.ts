import { AuctionType } from "../../enum/enum";
import { BidAuction } from "../../types/bid/BidAuction";
import { AuctionDto } from "../../types/dtos/Auction.dto";
import { TierPrice } from "../../types/common/TierPrice";
import {
    isBundleAuction,
    isProAuction,
    getProfitableBidAuctionsNormalVsPro,
    getProfitableBidAuctionsBundle
} from "./utils";

export const checkProfit = (
    auctions: AuctionDto[],
    floorPrices: TierPrice,
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
            floorPrices,
            bnbPrice,
            AuctionType.NORMAL
        )
    );
    profitableBidAuctions.push(
        ...getProfitableBidAuctionsNormalVsPro(proAuctions, floorPrices, bnbPrice, AuctionType.PRO)
    );
    profitableBidAuctions.push(
        ...getProfitableBidAuctionsBundle(bundleAuctions, floorPrices, bnbPrice)
    );
    return profitableBidAuctions;
};
