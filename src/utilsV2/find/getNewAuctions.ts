import axios from "axios";
import { AuctionDto } from "../../types/dtos/Auction.dto";
import { API_MOBOX } from "../../constants/constants";

export const getNewAutions = async (cacheIdsCheck: string[]): Promise<[AuctionDto[], string[]]> => {
    const newAuctions: AuctionDto[] = [];
    try {
        const data = await axios.get(
            `${API_MOBOX}/auction/search_v2/BNB?page=1&limit=${25}&category=&vType=&sort=-time&pType=`
        );
        const auctionsList = data?.data?.list || [];
        console.log(`Get new auctions: ${auctionsList.length}`);
        let count = 0;
        auctionsList.forEach((auction: AuctionDto) => {
            console.log(count++);
            if (
                auction.index !== undefined &&
                auction.index !== null &&
                auction.uptime &&
                auction.auctor &&
                !cacheIdsCheck.includes(auction.index + auction.uptime + auction.auctor) // Cant use tx for check new auction (batch auction same tx)
            ) {
                newAuctions.push(auction);
                cacheIdsCheck.push(auction.index + auction.uptime + auction.auctor);
                console.log(`New auction: ${count}`);
            }
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        console.log(`Error get new auctions, waiting for next loop...`);
        return [newAuctions, cacheIdsCheck];
    }
    if (cacheIdsCheck.length > 100) {
        cacheIdsCheck.splice(0, cacheIdsCheck.length - 50);
    }
    return [newAuctions, cacheIdsCheck];
};
