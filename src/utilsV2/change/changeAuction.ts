import { AuctionDto } from "@/types/dtos/Auction.dto";
import { sleep } from "../common/sleep";

export const changeAuction = async (auction: AuctionDto, newPrice: number) => {
    await sleep(1);
    console.log(`Change auction ${auction.prototype} from ${auction.nowPrice} to ${newPrice}`);
};
