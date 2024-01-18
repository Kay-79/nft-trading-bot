const config = {
    apiMP: "https://nftapi.mobox.io/auction/search_v2/BNB?page=1&limit=",
    addressToken: "0x55d398326f99059fF775485246999027B3197955",
    addressMP: "0xcb0cffc2b12739d4be791b8af7fbf49bc1d6a8c2",
    factoryContract: "0xaBf5C4ac3029f5f6892c3A98DE6DCaf3826C1394",
    wallet: {
        address: "0x444444961B7CC7b0F23BCF1bC666facf44135DA2",
        owner: "0x55555D4de8df0c455C2Ff368253388FE669a8888",
    },
    bidder: "0x55555D4de8df0c455C2Ff368253388FE669a8888",
    changer: "0x11119D51e2Ff85D5353ABf499Fe63bE3344c0000",
    rpcs: {
        bid: "https://bsc-dataseed3.bnbchain.org",
        change: "https://bsc-dataseed1.defibit.io",
        check: "https://bsc-dataseed1.bnbchain.org",
    },
    emojiURL: {
        fail: "\xE2\x9D\x8C",
        success: "\xE2\x9C\x85",
    },
    myAcc: [
        ["0x11119D51e2Ff85D5353ABf499Fe63bE3344c0000", "_1_0_1", true],
        ["0x55555D4de8df0c455C2Ff368253388FE669a8888", "_5_8_1", true],
        ["0x73A4AbD430C821B49423dB5279fb56ee72073292", "_7_3_A", true],
        ["0xA6fBE2809210CC38255959a86EC5eA13f91B636A", "_A_6_f", true],
        ["0x1DfC0656AbCfE473F968066157B0d0D740aff4e6", "_1_D_f", true],
        ["0x2B4F0e0498A832275af360CbE832da8135A5d9C2", "_2_B_4", true],
        ["0xbf6F2114A230B399F0A9085AC0FC27Bd4148a465", "_b_f_6", true],
        ["0x88888dF23F9554e4B043B00E1F4AfB39Fc078888", "_8_8_8", true],
        ["0x0000a7514Bc1e72058B709A713d20c1fE68b7777", "_0_0_7", true],
        ["0x44444402BC4cA69CbAeE0887917AF8949D2d0000", "_4_4_0", true],
        ["0x95de5320fffbF793D4Da4C659390D3C8647d2B99", "_9_5_d", true],
        ["0x179815260f9265950286918fa34b624071e09d68", "_1_7_9", true],
    ],
    timeDelays: {
        normal: 4,
        pro: 8,
    },
    timeDelayPerLoop: 0,
    profits: {
        common: 0.3,
        uncommon: 0.3,
        unique: 0.2,
        rare: 4,
        epic: 10,
        legendary: 1000,
    },
    rateFee: 0.35,
    minPrice: {
        minCommon: 3.5,
        minUncommon: 1.5,
        minUnique: 0.9,
        minRare: 14,
    },
    timeBid: 132.0,
    accBuy: "0x95de5320fffbF793D4Da4C659390D3C8647d2B99",
};

module.exports = config;
