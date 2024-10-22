import { AuctionDto } from "../dtos/Auction.dto";
import { TierPrice } from "../dtos/TierPrice.dto";

export class BidAuction {
    id?: string;
    uptime?: number;
    profit?: number;
    minProfit?: number;
    buyer?: string;
    contractAddress?: string;
    nowPrice?: number;
    minPrice?: TierPrice;
    fee?: number;
    type?: string;
    auctions?: AuctionDto[];
}
