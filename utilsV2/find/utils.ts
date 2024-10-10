import { AuctionDto } from "../../types/dtos/Auction.dto";
import { TierValue } from "../../types/dtos/TierValue.dto";
import { config } from "../../config/config";

export const isProAuction = (auction: AuctionDto): boolean => {
    return auction.amounts?.length === 0;
};
export const isBundleAuction = (auction: AuctionDto): boolean => {
    return (auction.amounts?.length ?? 0) > 1 || Number(auction.amounts?.[0] ?? 0) > 1
        ? true
        : false;
};
export const isNormalAuction = (auction: AuctionDto): boolean => {
    return !isProAuction(auction) && !isBundleAuction(auction);
};

export const getMinValueType = (
    prototype: string,
    amount: number,
    minPrices: TierValue
): number[] => {
    const prototypeIndex = Number(prototype.slice(0, 1));
    const minV = (minPrices[prototypeIndex as keyof TierValue] ?? NaN) * amount;
    const minP = (config.profirPerTier[prototypeIndex as keyof TierValue] ?? NaN) * amount;
    return [minV, minP];
};

export const feeBundle = (bnbPrice: number): number => {
    return config.gasPrices.bundleAuction * bnbPrice * 10 ** -9;
};
