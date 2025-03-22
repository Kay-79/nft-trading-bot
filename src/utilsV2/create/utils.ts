import { getAuctionsByPrototype } from "../change/utils";
import { allContracts } from "@/config/config";
import { ethers } from "ethers";
import { shortenNumber } from "@/utils/shorten";

export const getPriceSuggestNormal = async (prototype: number): Promise<number> => {
    const auctionsSamePrototype = await getAuctionsByPrototype(prototype);
    const auctionLowestPrice = auctionsSamePrototype
        .filter(a => a.nowPrice)
        .sort((a, b) => (a.nowPrice ?? 0) - (b.nowPrice ?? 0))[0];
    const auctor = auctionLowestPrice?.auctor;
    if (
        auctor &&
        (allContracts.includes(auctor) || allContracts.includes(ethers.getAddress(auctor)))
    ) {
        return shortenNumber(auctionLowestPrice.nowPrice || 999 * 10 ** 9, 9, 3);
    } else
        return shortenNumber(
            (auctionLowestPrice.nowPrice || 999 * 10 ** 9) - 0.001 * 10 ** 9,
            9,
            3
        );
};
