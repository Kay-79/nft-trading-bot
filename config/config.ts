import { TierPrice } from "../types/dtos/TierPrice.dto";

export const config: { profirPerTier: TierPrice } = {
    profirPerTier: {
        1: 0.1,
        2: 0.2,
        3: 0.3,
        4: 4,
        5: 10,
        6: 100
    }
};
