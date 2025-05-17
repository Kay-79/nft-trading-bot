import { ChangeDecision } from "@/types/change/ChangeDecision";
import { TierPrice } from "@/types/common/TierPrice";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { sleep } from "../common/sleep";
import { contracts, minPriceAIChange } from "@/config/config";
import { getAuctionsByPrototype } from "./utils";
import { ethers } from "ethers";
import { shortenNumber } from "@/utils/shorten";
import {
    boostPrice,
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
    myAuction: AuctionDto,
    floorPrices: TierPrice
): Promise<ChangeDecision> => {
    if (
        !myAuction.prototype ||
        !myAuction.nowPrice ||
        !myAuction.uptime ||
        !myAuction.auctor ||
        !modeChange.pro
    ) {
        return { shouldChange: false, newPrice: 0 };
    }
    if (
        Date.now() / 1000 - myAuction.uptime <
        Math.max(minTimeListedMyAuctionToChange.pro.up, minTimeListedMyAuctionToChange.pro.down)
    ) {
        return { shouldChange: false, newPrice: 0 };
    }
    if (!contracts.includes(ethers.getAddress(myAuction.auctor))) {
        console.log("Not my myAuction");
        return { shouldChange: false, newPrice: 0 };
    }
    const floorPrice = floorPrices[Math.floor(myAuction.prototype / 10 ** 4)];
    if (!floorPrice) {
        console.log("No floor price for prototype", myAuction.prototype);
        return { shouldChange: false, newPrice: 0 };
    }
    try {
        const prediction = shortenNumber(await predictAuctionPro(myAuction), 0, 3);
        const minPriceRequire = minPriceAIChange[myAuction.prototype / 10 ** 4];
        if (minPriceRequire && prediction < minPriceRequire) {
            console.log("Prediction is too low, not changing");
            return { shouldChange: false, newPrice: 0 };
        }
        if (
            shortenNumber(myAuction.nowPrice, 9, 3) > prediction &&
            Date.now() / 1000 - myAuction.uptime > minTimeListedMyAuctionToChange.pro.up
        ) {
            return {
                shouldChange: true,
                newPrice: shortenNumber(
                    Math.max(prediction * boostPrice - priceDelta, floorPrice),
                    0,
                    2
                )
            };
        } else {
            if (Date.now() / 1000 - myAuction.uptime > minTimeListedMyAuctionToChange.pro.down) {
                return {
                    shouldChange: true,
                    newPrice: shortenNumber(
                        Math.max(prediction * boostPrice - priceDelta, floorPrice),
                        0,
                        2
                    )
                };
            }
        }
    } catch (error) {
        console.log("Error when predict myAuction pro", error);
        return { shouldChange: false, newPrice: 0 };
    }
    return { shouldChange: false, newPrice: 0 };
};

export const getChangeDecisionNormal = async (
    myAuction: AuctionDto,
    floorPrices: TierPrice
): Promise<ChangeDecision> => {
    if (
        !myAuction.prototype ||
        !myAuction.nowPrice ||
        !myAuction.uptime ||
        !myAuction.auctor ||
        !modeChange.normal
    ) {
        return { shouldChange: false, newPrice: 0 };
    }
    if (!contracts.includes(ethers.getAddress(myAuction.auctor))) {
        console.log("Not my myAuction");
        return { shouldChange: false, newPrice: 0 };
    }
    const auctionsSamePrototype = await getAuctionsByPrototype(myAuction.prototype);
    const auctionLowestPrice = auctionsSamePrototype
        .filter(a => a.nowPrice)
        .sort((a, b) => (a.nowPrice ?? 0) - (b.nowPrice ?? 0))[0];

    if (!auctionLowestPrice?.auctor || !auctionLowestPrice.nowPrice || !auctionLowestPrice.uptime) {
        return { shouldChange: false, newPrice: 0 };
    }

    if (!(await isExistAuction(auctionLowestPrice))) {
        console.log("Not exist, maybe changed or bought");
        return { shouldChange: false, newPrice: 0 };
    }

    if (
        Date.now() / 1000 - myAuction.uptime < minTimeListedMyAuctionToChange.normal ||
        Date.now() / 1000 - auctionLowestPrice.uptime < minTimeListedOtherAuctionToChange ||
        contracts.includes(ethers.getAddress(auctionLowestPrice.auctor))
    ) {
        console.log("Require minTimeListedMyAuctionToChange, Lowest price is from your contract");
        return { shouldChange: false, newPrice: 0 };
    }

    let newPrice = shortenNumber(auctionLowestPrice.nowPrice - priceDelta * 10 ** 9, 9, 3);
    const floorPrice = floorPrices[Math.floor(myAuction.prototype / 10 ** 4)];
    if (newPrice < floorPrice || Math.abs(newPrice - floorPrice) < priceThreshold) {
        newPrice = Math.min(
            floorPrice - priceDeltaMin,
            shortenNumber(auctionLowestPrice.nowPrice, 9, 3) - priceDeltaMin
        );
        if (newPrice < floorPrice - 0.15) {
            return { shouldChange: false, newPrice: 0 };
        }
    }

    if (newPrice >= shortenNumber(myAuction.nowPrice, 9, 3)) {
        return { shouldChange: false, newPrice: 0 };
    }

    return { shouldChange: true, newPrice: shortenNumber(newPrice, 0, 3) };
};

export const getChangeDecisionBundle = async (
    myAuction: AuctionDto,
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
    if (!myAuction.uptime && floorPrices) {
        console.log("No uptime, maybe changed or bought");
    }
    await sleep(1);
    return changeDecision;
};
