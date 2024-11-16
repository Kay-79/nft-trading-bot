export interface GasPrices {
    proAuction: number;
    bundleAuction: number;
    normalAuction: { [key: number]: number };
}
