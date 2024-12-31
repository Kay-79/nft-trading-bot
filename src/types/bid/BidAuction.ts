import { AuctionType } from "../../enum/enum";
import { AuctionDto } from "../dtos/Auction.dto";
import { TierPrice } from "../common/TierPrice";

export class BidAuction {
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
    type?: AuctionType;
    amount?: number;
    auctions?: AuctionDto[];
    minGasPrice?: number;
    maxGasPrice?: number;
}
