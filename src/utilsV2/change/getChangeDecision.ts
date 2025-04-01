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

export const getChangeDecisionPro = async (
    auction: AuctionDto,
    floorPrices: TierPrice
): Promise<ChangeDecision> => {
    if (!(await isExistAuction(auction))) {
        console.log("Not exist, maybe changed or bought");
        return { shouldChange: false, newPrice: 0 };
    }
    const changeDecision: ChangeDecision = {
        shouldChange: false,
        newPrice: 0
    };
    if (!modeChange.pro) {
        console.log("Pro mode is disabled");
        return changeDecision;
    }
    if (!auction.uptime && floorPrices) {
        console.log("No uptime, maybe changed or bought");
    }
    await sleep(1);
    return changeDecision;
};

// export const getChangeDecisionNormal = async (
//     auction: AuctionDto,
//     floorPrices: TierPrice
// ): Promise<ChangeDecision> => {
//     const changeDecision: ChangeDecision = {
//         shouldChange: false,
//         newPrice: 0
//     };

//     if (!auction.prototype || !auction.nowPrice || !auction.uptime) {
//         console.log("No prototype");
//         return changeDecision;
//     }

//     if (!modeChange.normal) {
//         console.log("Normal mode is disabled");
//         return changeDecision;
//     }

//     if (!auction.uptime && floorPrices) {
//         console.log("No uptime, maybe changed or bought");
//         return changeDecision;
//     }
//     const auctionsSamePrototype = await getAuctionsByPrototype(auction.prototype);
//     const auctionLowestPrice = auctionsSamePrototype
//         .filter(a => a.nowPrice)
//         .sort((a, b) => (a.nowPrice ?? 0) - (b.nowPrice ?? 0))[0];
//     if (!(await isExistAuction(auctionLowestPrice)) || !(await isExistAuction(auction))) {
//         console.log("Not exist, maybe changed or bought");
//         return changeDecision;
//     }
//     if (!auctionLowestPrice?.auctor || !auctionLowestPrice.nowPrice || !auctionLowestPrice.uptime) {
//         console.log("No lowest price");
//         return changeDecision;
//     }

//     if (
//         Date.now() / 1000 - auction.uptime < minTimeListedMyAuctionToChange ||
//         Date.now() / 1000 - auctionLowestPrice.uptime < minTimeListedOtherAuctionToChange
//     ) {
//         console.log("Require minTimeListedMyAuctionToChange");
//         return changeDecision;
//     }

//     if (
//         contracts.includes(auctionLowestPrice.auctor.toLowerCase()) ||
//         contracts.includes(ethers.getAddress(auctionLowestPrice.auctor))
//     ) {
//         console.log("Lowest price is from your contract");
//         return changeDecision;
//     }

//     changeDecision.shouldChange = true;
//     changeDecision.newPrice = shortenNumber(
//         auctionLowestPrice.nowPrice - priceDelta * 10 ** 9,
//         9,
//         3
//     );
//     const floorPrice = floorPrices[Math.floor(auction.prototype / 10 ** 4)];
//     if (
//         changeDecision.newPrice < floorPrice ||
//         Math.abs(changeDecision.newPrice - floorPrice) < priceThreshold
//     ) {
//         console.log("New price is lower than floor price");
//         changeDecision.newPrice = shortenNumber(floorPrice - priceDeltaMin, 0, 3);
//         if (changeDecision.newPrice >= shortenNumber(auctionLowestPrice.nowPrice, 9, 3)) {
//             changeDecision.newPrice = shortenNumber(
//                 auctionLowestPrice.nowPrice - priceDeltaMin,
//                 9,
//                 3
//             );
//             if (changeDecision.newPrice < floorPrice - 0.15) {
//                 changeDecision.shouldChange = false;
//                 console.log("Lowest price is higher than current price");
//                 return changeDecision;
//             }
//         }
//     }

//     if (changeDecision.newPrice >= shortenNumber(auction.nowPrice, 9, 3)) {
//         changeDecision.shouldChange = false;
//         console.log("Lowest price is higher than current price");
//         return changeDecision;
//     }

//     return changeDecision;
// };

export const getChangeDecisionNormal = async (
    auction: AuctionDto,
    floorPrices: TierPrice
): Promise<ChangeDecision> => {
    if (!auction.prototype || !auction.nowPrice || !auction.uptime || !modeChange.normal) {
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
        Date.now() / 1000 - auction.uptime < minTimeListedMyAuctionToChange ||
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
