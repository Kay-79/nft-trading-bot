import { ChangeDecision } from "@/types/change/ChangeDecision";
import { TierPrice } from "@/types/common/TierPrice";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { sleep } from "../common/sleep";
import { contracts } from "@/config/config";
import { getAuctionsByPrototype } from "./utils";
import { ethers } from "ethers";
import { shortenNumber } from "@/utils/shorten";
import {
    minTimeListedMyAuctionToChange,
    minTimeListedOtherAuctionToChange,
    modeChange,
    priceDelta,
    priceDeltaMin,
    priceThreshold
} from "@/config/changeConfig";
import { isExistAuction } from "../bid/utils";
import { predictAuctionPro } from "@/AI/utils";

export const getChangeDecisionPro = async (
    auction: AuctionDto,
    floorPrices: TierPrice
): Promise<ChangeDecision> => {
    if (
        !auction.prototype ||
        !auction.nowPrice ||
        !auction.uptime ||
        !auction.auctor ||
        !modeChange.pro
    ) {
        return { shouldChange: false, newPrice: 0 };
    }
    if (Date.now() / 1000 - auction.uptime < minTimeListedMyAuctionToChange.pro) {
        console.log("Require minTimeListedMyAuctionToChange.pro");
        return { shouldChange: false, newPrice: 0 };
    }
    if (
        !(
            contracts.includes(auction.auctor.toLowerCase()) ||
            contracts.includes(ethers.getAddress(auction.auctor))
        )
    ) {
        console.log("Not my auction");
        return { shouldChange: false, newPrice: 0 };
    }
    if (!(await isExistAuction(auction))) {
        console.log("Not exist, maybe changed or bought");
        return { shouldChange: false, newPrice: 0 };
    }
    const floorPrice = floorPrices[Math.floor(auction.prototype / 10 ** 4)];
    try {
        const prediction = shortenNumber(await predictAuctionPro(auction), 0, 3);
        if (shortenNumber(auction.nowPrice, 9, 3) > prediction) {
            return {
                shouldChange: true,
                newPrice: shortenNumber(Math.max(prediction - priceDelta, floorPrice), 0, 3)
            };
        } else {
            if (Date.now() / 1000 - auction.uptime > 2 * minTimeListedMyAuctionToChange.pro) {
                return {
                    shouldChange: true,
                    newPrice: shortenNumber(Math.max(prediction - priceDelta, floorPrice), 0, 3)
                };
            }
        }
    } catch (error) {
        console.log("Error when predict auction pro", error);
        return { shouldChange: false, newPrice: 0 };
    }
    return { shouldChange: false, newPrice: 0 };
};

export const getChangeDecisionNormal = async (
    auction: AuctionDto,
    floorPrices: TierPrice
): Promise<ChangeDecision> => {
    if (
        !auction.prototype ||
        !auction.nowPrice ||
        !auction.uptime ||
        !auction.auctor ||
        !modeChange.normal
    ) {
        return { shouldChange: false, newPrice: 0 };
    }
    if (
        !(
            contracts.includes(auction.auctor.toLowerCase()) ||
            contracts.includes(ethers.getAddress(auction.auctor))
        )
    ) {
        console.log("Not my auction");
        return { shouldChange: false, newPrice: 0 };
    }
    const auctionsSamePrototype = await getAuctionsByPrototype(auction.prototype);
    const auctionLowestPrice = auctionsSamePrototype
        .filter(a => a.nowPrice)
        .sort((a, b) => (a.nowPrice ?? 0) - (b.nowPrice ?? 0))[0];

    if (!auctionLowestPrice?.auctor || !auctionLowestPrice.nowPrice || !auctionLowestPrice.uptime) {
        return { shouldChange: false, newPrice: 0 };
    }

    if (!(await isExistAuction(auctionLowestPrice)) || !(await isExistAuction(auction))) {
        console.log("Not exist, maybe changed or bought");
        return { shouldChange: false, newPrice: 0 };
    }

    if (
        Date.now() / 1000 - auction.uptime < minTimeListedMyAuctionToChange.normal ||
        Date.now() / 1000 - auctionLowestPrice.uptime < minTimeListedOtherAuctionToChange ||
        contracts.includes(auctionLowestPrice.auctor.toLowerCase()) ||
        contracts.includes(ethers.getAddress(auctionLowestPrice.auctor))
    ) {
        console.log("Require minTimeListedMyAuctionToChange, Lowest price is from your contract");
        return { shouldChange: false, newPrice: 0 };
    }

    let newPrice = shortenNumber(auctionLowestPrice.nowPrice - priceDelta * 10 ** 9, 9, 3);
    const floorPrice = floorPrices[Math.floor(auction.prototype / 10 ** 4)];
    if (newPrice < floorPrice || Math.abs(newPrice - floorPrice) < priceThreshold) {
        newPrice = Math.min(
            floorPrice - priceDeltaMin,
            shortenNumber(auctionLowestPrice.nowPrice, 9, 3) - priceDeltaMin
        );
        if (newPrice < floorPrice - 0.15) {
            return { shouldChange: false, newPrice: 0 };
        }
    }

    if (newPrice >= shortenNumber(auction.nowPrice, 9, 3)) {
        return { shouldChange: false, newPrice: 0 };
    }

    return { shouldChange: true, newPrice: shortenNumber(newPrice, 0, 3) };
};

export const getChangeDecisionBundle = async (
    auction: AuctionDto,
    floorPrices: TierPrice
): Promise<ChangeDecision> => {
    const changeDecision: ChangeDecision = {
        shouldChange: false,
        newPrice: 0
    };
    if (!modeChange.bundle) {
        console.log("Bundle mode is disabled");
        return changeDecision;
    }
    if (!auction.uptime && floorPrices) {
        console.log("No uptime, maybe changed or bought");
    }
    await sleep(1);
    return changeDecision;
};
