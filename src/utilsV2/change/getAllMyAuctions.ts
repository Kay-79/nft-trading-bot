import axios from "axios";
import { AuctionDto } from "../../types/dtos/Auction.dto";
import { API_MOBOX } from "../../constants/constants";
import { contracts } from "@/config/config";
import { ranSleep } from "../common/sleep";
import { shortenAddress } from "../common/utils";

const getListAutions = async (address: string): Promise<AuctionDto[]> => {
    try {
        const data = await axios.get(
            `${API_MOBOX}/auction/list/BNB/${address}?sort=-time&page=1&limit=128`
        );
        return data?.data?.list || [];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        console.log(`Error get new auctions, waiting for next loop...`);
        return [];
    }
};

export const getAllMyAuctions = async (): Promise<AuctionDto[]> => {
    let allAuctions: AuctionDto[] = [];
    for (const contract of contracts) {
        console.log(`Getting auctions from ${shortenAddress(contract)}`);
        await ranSleep(30, 100);
        const listAuctions = await getListAutions(contract);
        allAuctions = allAuctions.concat(listAuctions);
    }
    return allAuctions;
};
