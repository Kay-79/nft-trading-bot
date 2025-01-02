import axios from "axios";
import { API_MOBOX } from "../../constants/constants";
import { AuctionGroupDto } from "types/dtos/AuctionGroup.dto";

export const getNewAuctionGroups = async (
    cacheIdsCheck: string[]
): Promise<[AuctionGroupDto[], string[]]> => {
    let newAuctionGroups: AuctionGroupDto[] = [];
    try {
        const data = await axios.get(
            `${API_MOBOX}/auction/search_v2/BNB?page=1&limit=${25}&category=&vType=&sort=-time&pType=`
        );
        const auctionsList = data?.data?.list || [];
        auctionsList.forEach((auctionGroup: AuctionGroupDto) => {
            if (auctionGroup.tx && !cacheIdsCheck.includes(auctionGroup.tx)) {
                newAuctionGroups.push(auctionGroup);
                cacheIdsCheck.push(auctionGroup.tx);
            }
        });
    } catch (error) {
        console.log(`Error get new auctions, waiting for next loop...`);
        return [newAuctionGroups, cacheIdsCheck];
    }
    if (cacheIdsCheck.length > 100) {
        cacheIdsCheck.splice(0, cacheIdsCheck.length - 50);
    }
    return [newAuctionGroups, cacheIdsCheck];
};
