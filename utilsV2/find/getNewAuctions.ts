import axios from "axios";
import { config } from "../../config/config";
import { AuctionDto } from "../../types/dtos/Auction.dto";

export const getNewAutions = async (cacheIdsCheck: string[]): Promise<[AuctionDto[], string[]]> => {
    const data = await axios.get(
        `${
            config.apiDomain
        }/auction/search_v2/BNB?page=1&limit=${25}&category=&vType=&sort=-time&pType=`
    );
    let newAuctions: AuctionDto[] = [];
    data.data.list.forEach((auction: AuctionDto) => {
        if (auction.id && !cacheIdsCheck.includes(auction.id)) {
            newAuctions.push(auction);
            cacheIdsCheck.push(auction.id);
        }
    });
    if (cacheIdsCheck.length > 100) {
        cacheIdsCheck = cacheIdsCheck.slice(cacheIdsCheck.length - 50);
    }
    return [newAuctions, cacheIdsCheck];
};
