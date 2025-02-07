import { BidAuction } from "../../types/bid/BidAuction";
import { AuctionDto } from "../../types/dtos/Auction.dto";
import { TierPrice } from "../../types/common/TierPrice";
import {
    isBundleAuction,
    isProAuction,
    getProfitableBidAuctionsNormalVsPro,
    getProfitableBidAuctionsBundle
} from "./utils";
import { BidType } from "enum/enum";

export const checkProfitAuctions = async (
    auctions: AuctionDto[],
    floorPrices: TierPrice,
    bnbPrice: number,
    mboxPrice: number,
    rewardPer1000Hash: number
): Promise<BidAuction[]> => {
    if (!auctions || auctions.length === 0) {
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
        ...(await getProfitableBidAuctionsNormalVsPro(
            normalAuctions,
            floorPrices,
            bnbPrice,
            BidType.NORMAL,
            NaN,
            NaN
        ))
    );
    profitableBidAuctions.push(
        ...(await getProfitableBidAuctionsNormalVsPro(
            proAuctions,
            floorPrices,
            bnbPrice,
            BidType.PRO,
            mboxPrice,
            rewardPer1000Hash
        ))
    );
    profitableBidAuctions.push(
        ...getProfitableBidAuctionsBundle(bundleAuctions, floorPrices, bnbPrice)
    );
    return profitableBidAuctions;
};
