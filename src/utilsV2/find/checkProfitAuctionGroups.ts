import { BidAuction } from "../../types/bid/BidAuction";
import { AuctionGroupDto } from "types/dtos/AuctionGroup.dto";
import { TierPrice } from "../../types/common/TierPrice";
import { getProfitableBidAuctionsBlockBatch, getProfitableBidAuctionsBlockSingle } from "./utils";
import { BidType, BlockType } from "enum/enum";

export const checkProfitAuctionGroups = async (
    auctionGroups: AuctionGroupDto[],
    floorPrices: TierPrice,
    bnbPrice: number
): Promise<BidAuction[]> => {
    if (!auctionGroups || auctionGroups.length === 0) {
        return [];
    }
    let profitableBidAuctionGroups: BidAuction[] = [];
    let groupSingleAuctions: AuctionGroupDto[] = [];
    let groupBatchAuctions: AuctionGroupDto[] = [];
    for (let i = 0; i < auctionGroups.length; i++) {
        const auctionGroup = auctionGroups[i];
        if (auctionGroup.type === BlockType.SINGLE) {
            groupSingleAuctions.push(auctionGroup);
        } else if (auctionGroup.type === BlockType.BATCH) {
            groupBatchAuctions.push(auctionGroup);
        }
    }
    profitableBidAuctionGroups.push(
        ...(await getProfitableBidAuctionsBlockSingle(
            groupSingleAuctions,
            floorPrices,
            bnbPrice,
            BidType.GROUP
        ))
    );
    profitableBidAuctionGroups.push(
        ...(await getProfitableBidAuctionsBlockBatch(
            groupBatchAuctions,
            floorPrices,
            bnbPrice,
            BidType.GROUP
        ))
    );
    return profitableBidAuctionGroups;
};
