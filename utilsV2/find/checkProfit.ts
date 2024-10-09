import { AuctionDto } from "../../types/dtos/Auction.dto";
import { PriceMinDto } from "../../types/dtos/PriceMin.dto";

const checkProfit = (auction: AuctionDto, priceMins: PriceMinDto) => {
    let profit = 0;
    if (auction.tokenId) {
        //>>rare
        
    } else {
        //normal
    }
    console.log(profit);
    return profit;
};
checkProfit({} as AuctionDto, {} as PriceMinDto);