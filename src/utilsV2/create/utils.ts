import { getAuctionsByPrototype } from "../change/utils";
import { allContracts } from "@/config/config";
import { ethers } from "ethers";
import { shortenNumber } from "@/utils/shorten";

export const getPriceSuggestNormal = async (prototype: number): Promise<number> => {
    const auctionsSamePrototype = await getAuctionsByPrototype(prototype);
    if (auctionsSamePrototype.length === 0) return shortenNumber(15 * 10 ** 9, 9, 3);
    const auctionSorted = auctionsSamePrototype.sort(
        (a, b) => (a.nowPrice ?? 0) - (b.nowPrice ?? 0)
    );
    const auctionLowestPrice = auctionSorted[0];
    const auctor = auctionLowestPrice?.auctor;
    if (
        auctor &&
        (allContracts.includes(auctor) || allContracts.includes(ethers.getAddress(auctor)))
    ) {
        for (let i = 0; i < auctionSorted.length; i++) {
            if (auctor !== auctionSorted[i].auctor) {
                return shortenNumber(
                    (auctionSorted[i].nowPrice || 999 * 10 ** 9) - 0.001 * 10 ** 9,
                    9,
                    3
                );
            }
        }
        return shortenNumber(auctionLowestPrice.nowPrice || 999 * 10 ** 9, 9, 3);
    } else
        return shortenNumber(
            (auctionLowestPrice.nowPrice || 999 * 10 ** 9) - 0.001 * 10 ** 9,
            9,
            3
        );
};
