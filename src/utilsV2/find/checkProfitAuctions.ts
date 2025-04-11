import { BidAuction } from "../../types/bid/BidAuction";
import { AuctionDto } from "../../types/dtos/Auction.dto";
import { TierPrice } from "../../types/common/TierPrice";
import {
    isBundleAuction,
    isProAuction,
    getProfitableBidAuctionsNormalVsPro,
    getProfitableBidAuctionsBundle,
    isNormalAuction
} from "./utils";
import { BidType } from "@/enum/enum";

export const checkProfitAuctions = async (
    auctions: AuctionDto[],
    floorPrices: TierPrice,
    bnbPrice: number
): Promise<BidAuction[]> => {
    if (!auctions || auctions.length === 0) {
        return [];
    }
    const profitableBidAuctions: BidAuction[] = [];
    const normalAuctions: AuctionDto[] = [];
    const proAuctions: AuctionDto[] = [];
    const bundleAuctions: AuctionDto[] = [];
    for (let i = 0; i < auctions.length; i++) {
        const auction = auctions[i];
        if (isProAuction(auction)) {
            proAuctions.push(auction);
        } else if (isBundleAuction(auction)) {
            bundleAuctions.push(auction);
        } else if (isNormalAuction(auction)) {
            normalAuctions.push(auction);
        }
    }
    profitableBidAuctions.push(
        ...(await getProfitableBidAuctionsNormalVsPro(
            normalAuctions,
            floorPrices,
            bnbPrice,
            BidType.NORMAL
        ))
    );
    profitableBidAuctions.push(
        ...(await getProfitableBidAuctionsNormalVsPro(
            proAuctions,
            floorPrices,
            bnbPrice,
            BidType.PRO
        ))
    );
    profitableBidAuctions.push(
        ...getProfitableBidAuctionsBundle(bundleAuctions, floorPrices, bnbPrice)
    );
    return profitableBidAuctions;
};
