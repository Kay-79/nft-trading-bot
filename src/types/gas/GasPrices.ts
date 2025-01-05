export interface GasPrices {
    proAuction: number;
    bundleAuction: number;
    normalAuction: { [key: number]: number };
    auctionGroup: {
        bep721: { [key: number]: number };
        crew: { [key: number]: number };
        default: number;
    };
}
