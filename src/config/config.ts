import { ModeBot } from "@/types/common/ModeBot";
import { ProfitConfig } from "@/types/common/ProfitConfig";
import { TierPrice } from "@/types/common/TierPrice";
import { LatestGet } from "@/types/find/LatestGet";

export const modeBot: ModeBot = {
    auction: {
        normal: true,
        pro: true,
        bundle: true
    },
    auctionGroup: {
        bep721: true,
        crew: true
    },
    box: false,
    mecBox: false,
    gem: false
};

export const profitPerTier: TierPrice = {
    1: 0.15,
    2: 0.125,
    3: 0.1,
    4: 3,
    5: 5,
    6: 500
};

export const profitBlock: ProfitConfig = {
    min: 10,
    percent: 0.55
};

export const profitProAI: ProfitConfig = {
    min: 10,
    percent: 0.55
};

export const delayTimeGet: LatestGet = {
    auction: 10,
    auctionGroup: 60 * 4,
    box: NaN,
    mecBox: NaN,
    gem: NaN
};

export const newbieBidders: string[] = [
    "0xF91116A59E7a004030fDB42070e3E8A97912591a",
    "0x8B5DA11bD2955569a6408050246f14b5340f61c8"
];

export const newbieAuctors: string[] = [
    "0x3cf0689468a046c3f353F41a71bBeF2c5F486980",
    "0xd3ff2923508ef254f12eb6316481b72b0052506e",
    "0x72264a0Dd6794094992fD7A221F894118A113875",
    "0x4cb440a92e8ac308d44c0c9799342dbce1dc1d13"
];

export const contracts: string[] = [
    "0x2D02D9fa00eFE096068c733e925035aBB9661e98", // version 3
    "0x5Af0F366B44161AF0c412adA0c2840CFbd8e6A81",
    "0x2D34E0171db021b2e0A0ECb4eA298DBE708a6C68",
    "0xbad9ecD57d69E4b16073936c8453FD4b0F7D31Fd",
    "0x1Cf2c4119A6e65C3053be65103b5e276506449eB",
    "0x4cAefa2AB16075B3527fE3757BC7987845796d5E", // version 6.1.8
    "0x19De8F7bB60032b212d8Ed570fF97d60Fe52298F",
    "0xE4534fA363016b1BD1E95C20144361cFB7c2d3aC"
];

export const allContracts: string[] = [...contracts, "0x0e9bc747335a4b01a6194a6c1bb1de54a0a5355c"];

export const proBidders: string[] = [
    ...allContracts,
    // pro traders
    "0x8C6d06D614aB70a3AB6fAAf7cFF83102D840458b",
    "0x198D66Dc32310579bF041203c8e9d1cc5baeb941",
    "0x9488821c7d84ce4b72c7f85b2ad12b84bacfe7c5",
    "0xE13eBac7c22863396eE16877Aa4A049D671B4FA5",
    "0x8B5DA11bD2955569a6408050246f14b5340f61c8",
    "0xbaf0B0F1D4aE45E71650988f054856da5027558C",
    "0xF05b880600e41Fd2f72A2F191eD3bF7e79bA383D",
    "0x12F5B2f75b873592ac9f7101bC1580AbaB2C0434",
    "0xF6558e2EAd2A38efA452D1FFE2404cc028a415bC",
    "0x4114463f52401b22c8127bc76bc7ec129928ca97"
];

export const bidContract = "0xE4534fA363016b1BD1E95C20144361cFB7c2d3aC";

export const bidContractPro = "0xE4534fA363016b1BD1E95C20144361cFB7c2d3aC";
