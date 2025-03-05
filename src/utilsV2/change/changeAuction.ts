import { AuctionDto } from "@/types/dtos/Auction.dto";
import { sleep } from "../common/sleep";
import { shortenNumber } from "@/utils/shorten";

export const changeAuction = async (auction: AuctionDto, newPrice: number) => {
    await sleep(1);
    console.log(
        `Change auction ${auction.prototype} from ${shortenNumber(
            auction.nowPrice ?? 0,
            9,
            3
        )} to ${newPrice}`
    );
};
