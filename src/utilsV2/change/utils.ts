import { API_MOBOX } from "@/constants/constants";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import axios from "axios";

export const getAuctionsByPrototype = async (prototype: number): Promise<AuctionDto[]> => {
    const params = {
        page: 1,
        limit: 10,
        category: "",
        vType: "",
        sort: "price",
        pType: prototype
    };
    try {
        const data = await axios.get(`${API_MOBOX}/auction/search_v2/BNB`, { params });
        return data?.data?.list || [];
    } catch {
        console.log(`Error get new auctions, waiting for next loop...`);
        return [];
    }
};
