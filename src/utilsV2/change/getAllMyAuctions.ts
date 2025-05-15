import axios from "axios";
import { AuctionDto } from "../../types/dtos/Auction.dto";
import { API_MOBOX } from "../../constants/constants";
import { contracts } from "@/config/config";
import { ranSleep } from "../common/sleep";

const getListAutions = async (address: string): Promise<AuctionDto[]> => {
    try {
        const data = await axios.get(
            `${API_MOBOX}/auction/list/BNB/${address}?sort=-time&page=1&limit=128`
        );
        return data?.data?.list || [];
    } catch {
        return [];
    }
};

export const getAllMyAuctions = async (): Promise<AuctionDto[]> => {
    let allAuctions: AuctionDto[] = [];
    for (const contract of contracts) {
        await ranSleep(45, 60);
        const listAuctions = await getListAutions(contract);
        allAuctions = allAuctions.concat(listAuctions);
    }
    return allAuctions;
};
