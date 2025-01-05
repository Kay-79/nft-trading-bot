import { BidType } from "../../enum/enum";
import { AuctionDto } from "../dtos/Auction.dto";
import { TierPrice } from "../common/TierPrice";
import { AuctionGroupDto } from "types/dtos/AuctionGroup.dto";

export interface BidAuction {
    id?: string;
    uptime?: number;
    profit?: number;
    minProfit?: number;
    buyer?: string;
    contractAddress?: string;
    totalPrice?: number;
    pricePrediction?: number;
    minPrice?: TierPrice;
    fee?: number;
    type?: BidType;
    amount?: number;
    auctions?: AuctionDto[];
    auctionGroups?: AuctionGroupDto[];
    minGasPrice?: number;
    maxGasPrice?: number;
}
