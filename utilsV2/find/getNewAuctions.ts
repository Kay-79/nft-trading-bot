import axios from "axios";
import { AuctionDto } from "../../types/dtos/Auction.dto";
import { API_DOMAIN } from "../../config/constans";

export const getNewAutions = async (cacheIdsCheck: string[]): Promise<[AuctionDto[], string[]]> => {
    let newAuctions: AuctionDto[] = [];
    try {
        const data = await axios.get(
            `${API_DOMAIN}/auction/search_v2/BNB?page=1&limit=${25}&category=&vType=&sort=-time&pType=`
        );
        data.data.list.forEach((auction: AuctionDto) => {
            if (auction.id && !cacheIdsCheck.includes(auction.id + auction.uptime)) {
                newAuctions.push(auction);
                cacheIdsCheck.push(auction.id + auction.uptime);
            }
        });
    } catch (error) {
        console.log(`Error get new auctions, waiting for next loop...`);
    }
    if (cacheIdsCheck.length > 100) {
        cacheIdsCheck = cacheIdsCheck.slice(cacheIdsCheck.length - 50);
    }
    return [newAuctions, cacheIdsCheck];
};
