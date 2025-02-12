import axios from "axios";
import { API_MOBOX } from "../../constants/constants";
import { AuctionGroupDto } from "@/types/dtos/AuctionGroup.dto";

export const getNewAuctionGroups = async (
    cacheIdsCheck: string[]
): Promise<[AuctionGroupDto[], string[]]> => {
    const newAuctionGroups: AuctionGroupDto[] = [];
    try {
        const data = await axios.get(
            `${API_MOBOX}/auction_group/list_v2?page=1&limit=${15}&sort=-time`
        );
        const auctionsList = data?.data?.list || [];
        auctionsList.forEach((auctionGroup: AuctionGroupDto) => {
            if (
                auctionGroup.orderId &&
                auctionGroup.uptime &&
                auctionGroup.auctor &&
                !cacheIdsCheck.includes(
                    auctionGroup.auctor + auctionGroup.orderId + auctionGroup.uptime
                )
            ) {
                newAuctionGroups.push(auctionGroup);
                cacheIdsCheck.push(
                    auctionGroup.auctor + auctionGroup.orderId + auctionGroup.uptime
                );
            }
        });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        console.log(`Error get new auctions, waiting for next loop...`);
        return [newAuctionGroups, cacheIdsCheck];
    }
    if (cacheIdsCheck.length > 100) {
        cacheIdsCheck.splice(0, cacheIdsCheck.length - 50);
    }
    return [newAuctionGroups, cacheIdsCheck];
};
