import axios from "axios";
import { AuctionDto } from "../../types/dtos/Auction.dto";
import { API_MOBOX } from "../../constants/constants";

export const getNewAutions = async (cacheIdsCheck: string[]): Promise<[AuctionDto[], string[]]> => {
    let newAuctions: AuctionDto[] = [];
    try {
        const data = await axios.get(
            `${API_MOBOX}/auction/search_v2/BNB?page=1&limit=${25}&category=&vType=&sort=-time&pType=`
        );
        const auctionsList = data?.data?.list || [];
        auctionsList.forEach((auction: AuctionDto) => {
            if (auction.tx && !cacheIdsCheck.includes(auction.tx)) {
                newAuctions.push(auction);
                cacheIdsCheck.push(auction.tx);
            }
        });
    } catch (error) {
        console.log(`Error get new auctions, waiting for next loop...`);
        return [newAuctions, cacheIdsCheck];
    }
    if (cacheIdsCheck.length > 100) {
        cacheIdsCheck.splice(0, cacheIdsCheck.length - 50);
    }
    return [newAuctions, cacheIdsCheck];
};
