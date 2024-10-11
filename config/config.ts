import { TierValue } from "../types/dtos/TierValue.dto";
import { GasPrices } from "../types/gas/GasPrices";

export const config: { profirPerTier: TierValue; gasPrices: GasPrices; apiDomain: string } = {
    profirPerTier: {
        1: 0.1,
        2: 0.2,
        3: 0.3,
        4: 4,
        5: 10,
        6: 100
    },
    gasPrices: {
        proAuction: 250000,
        bundleAuction: 350000,
        normalAuction: { 1: 250000, 2: 300000, 3: 325000, 4: 350000, 5: 450000, 6: 500000 }
    },
    apiDomain: "https://nftapi.mobox.io"
};
