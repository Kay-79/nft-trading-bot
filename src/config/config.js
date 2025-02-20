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
        change: "https://bsc-dataseed1.bnbchain.org",
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
        ["0x179815260f9265950286918fa34b624071E09D68", "_1_7_9", true], // getReward()
        ["0xfa11AA3953B46c12dC1fB5c880912A80BF52203A", "_f_a_1", true],
        ["0x891016f99BA622F8556bE12B4EA336157aA6cb20", "_8_9_1", true],
        ["0xb8C5744D347A74484925E19F588719C846616405", "_b_8_C", true],
        ["0x838e781DC9F070922F66f0BE415d15168bB04825", "_8_3_8", true],
        ["0x79791a6D45C4bCcaBf56dF64403d84EEFc4065EC", "_7_9_7", true],
        ["0x3A2887CEE9096cc90A00619F5fAFA5eeE8FC0e32", "_3_A_2", true],
        ["0x2D02D9fa00eFE096068c733e925035aBB9661e98", "_2_D_0", true], // version 3
        ["0x5Af0F366B44161AF0c412adA0c2840CFbd8e6A81", "_5_A_f", true],
        ["0x2D34E0171db021b2e0A0ECb4eA298DBE708a6C68", "_2_D_3", true]
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
    accBuy: "0x2D34E0171db021b2e0A0ECb4eA298DBE708a6C68"
};

module.exports = config;
