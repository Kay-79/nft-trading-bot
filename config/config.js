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
        // bid: "https://bsc-dataseed3.bnbchain.org",
        bid: "http://localhost:8545",
        // change: "https://bsc.publicnode.com",
        change: "http://localhost:8545",
        check: "https://bsc-dataseed1.bnbchain.org",
        create: "http://localhost:8545",
        public: "https://bsc-dataseed3.bnbchain.org",
    },
    wss: {
        private: "ws://localhost:8546",
        mainnet: "wss://bsc.publicnode.com",
        testnet: "wss://bsc-testnet.publicnode.com",
    },
    emojiURL: {
        fail: "\xE2\x9D\x8C",
        success: "\xE2\x9C\x85",
    },
    myAcc: [
        ["0x11119D51e2Ff85D5353ABf499Fe63bE3344c0000", "_1_0_1", true],
        ["0x55555D4de8df0c455C2Ff368253388FE669a8888", "_5_8_1", true],
        ["0x179815260f9265950286918fa34b624071E09D68", "_1_7_9", true], // getReward()
        ["0xfa11AA3953B46c12dC1fB5c880912A80BF52203A", "_f_a_1", true],
        ["0x891016f99BA622F8556bE12B4EA336157aA6cb20", "_8_9_1", true],
        ["0xb8C5744D347A74484925E19F588719C846616405", "_b_8_C", true],
        // ["0x838e781DC9F070922F66f0BE415d15168bB04825", "_8_3_8", true],
        // ["0x79791a6D45C4bCcaBf56dF64403d84EEFc4065EC", "_7_9_7", true],
    ],
    timeDelays: {
        normal: 1,
        pro: 8,
    },
    minDecreasePrice: 0.2,
    amountChange: 1,
    gasPrices: {
        minBid: 3.1,
        create: 1.0001,
        change: 1.0001,
    },
    timeDelayPerLoop: 1,
    profits: {
        common: 0.1,
        uncommon: 0.1,
        unique: 0.1,
        rare: 4,
        epic: 10,
        legendary: 1000,
    },
    rateFee: 0.1,
    rateMax: 0.8,
    minPrice: {
        minCommon: 3.0,
        minUncommon: 1.0,
        minUnique: 0.5,
        minRare: 14,
    },
    timeBid: 133.5,
    accBuy: "0xb8C5744D347A74484925E19F588719C846616405",
};

module.exports = config;
