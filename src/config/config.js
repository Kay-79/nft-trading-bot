const config = {
    apiMP: "https://nftapi.mobox.io/auction/search_v2/BNB?page=1&limit=",
    addressToken: "0x55d398326f99059fF775485246999027B3197955",
    addressMP: "0xcb0cffc2b12739d4be791b8af7fbf49bc1d6a8c2",
    factoryContract: "0xaBf5C4ac3029f5f6892c3A98DE6DCaf3826C1394",
    wallet: {
        address: "0x444444961B7CC7b0F23BCF1bC666facf44135DA2",
        owner: "0x55555D4de8df0c455C2Ff368253388FE669a8888"
    },
    bidder: "0x55555D4de8df0c455C2Ff368253388FE669a8888",
    changer: "0x11119D51e2Ff85D5353ABf499Fe63bE3344c0000",
    // rpcs: {//handle made
    //     // bid: "https://bsc-dataseed3.bnbchain.org",
    //     bid: "http://127.0.0.1:8545",
    //     // change: "https://bsc.publicnode.com",
    //     change: "http://127.0.0.1:8545",
    //     check: "https://bsc-dataseed1.bnbchain.org",
    //     create: "http://127.0.0.1:8545",
    //     public: "https://bsc-dataseed3.bnbchain.org",
    //     protect: "https://bsc.rpc.blxrbdn.com"
    // },
    rpcs: {
        bid: "https://bsc-dataseed1.bnbchain.org",
        change: "https://bsc-dataseed.binance.org/",
        check: "https://bsc-dataseed1.bnbchain.org",
        // create: "https://bnb.rpc.subquery.network/public",
        create: "https://go.getblock.io/970d05bb6ae946339226221d29d5934e",
        // create: "https://solemn-wild-aura.bsc.quiknode.pro/9fbdf28f69f47aa85c76222be804b4224c2dbd22",
        public: "https://bsc-dataseed3.bnbchain.org",
        protect: "https://bsc.rpc.blxrbdn.com",
        quickNode:
            "https://solemn-wild-aura.bsc.quiknode.pro/9fbdf28f69f47aa85c76222be804b4224c2dbd22"
    },
    wss: {
        private: "ws://127.0.0.1:8546",
        mainnet: "wss://bsc.publicnode.com",
        testnet: "wss://bsc-testnet.publicnode.com"
    },
    emojiURL: {
        fail: "\xE2\x9D\x8C",
        success: "\xE2\x9C\x85"
    },
    myAcc: [
        ["0x11119D51e2Ff85D5353ABf499Fe63bE3344c0000", "_1_0_1", true],
        ["0x55555D4de8df0c455C2Ff368253388FE669a8888", "_5_8_1", true],
        ["0x0E9BC747335a4b01A6194A6c1bB1De54a0a5355c", "_0_E_9", true],
        ["0x2D02D9fa00eFE096068c733e925035aBB9661e98", "_2_D_0", true], // version 3
        ["0x5Af0F366B44161AF0c412adA0c2840CFbd8e6A81", "_5_A_f", true],
        ["0x2D34E0171db021b2e0A0ECb4eA298DBE708a6C68", "_2_D_3", true],
        ["0xbad9ecD57d69E4b16073936c8453FD4b0F7D31Fd", "_b_a_d", true],
        ["0x1Cf2c4119A6e65C3053be65103b5e276506449eB", "_1_C_f", true],
        ["0x4cAefa2AB16075B3527fE3757BC7987845796d5E", "_4_c_A", true], // version 6.1.8
        ["0x19De8F7bB60032b212d8Ed570fF97d60Fe52298F", "_1_9_D", true] // version 6.1.9
    ],
    timeDelays: {
        //in hours
        normal: 1.4,
        pro: 8
    },
    timeChangeSecond: {
        normal: 24,
        pro: 24
    },
    minDecreasePrice: 0.2,
    amountChange: 1,
    gasPrices: {
        minBid: 1.01,
        create: 1.0001,
        change: 1.0001
    },
    gasLimitBundle: 388000,
    timeDelayPerLoop: 2,
    profits: {
        common: 0.01,
        uncommon: 0.01,
        unique: 0.01,
        rare: 4,
        epic: 10,
        legendary: 1000
    },
    rateFee: 0.05,
    rateMax: 0.8,
    minPrice: {
        minCommon: 0,
        minUncommon: 0,
        minUnique: 0,
        minRare: 0
    },
    limitBlockUpdate: 2000,
    timeBid: 131.0,
    accBuy: "0x19De8F7bB60032b212d8Ed570fF97d60Fe52298F"
};

module.exports = config;
