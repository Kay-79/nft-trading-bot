export enum AuctionType {
    NORMAL = "NORMAL",
    BUNDLE = "BUNDLE",
    PRO = "PRO"
}

export enum Environment {
    TESTNET = "TESTNET",
    MAINNET = "MAINNET"
}

export enum FunctionFragment {
    BID = "bid(address,uint256,uint256,uint256)",
    BID_BATCH = "bid(address[],uint256[],uint256[],uint256[],bool)"
}

export enum BidStatus {
    SUCCESS = "✅",
    FAILED = "❌"
}

export enum MomoSelector {
    UNKNOWN_1 = "0x390c5f07", //unknow function selector
    UNKNOWN_2 = "0xd1728859", //get time unknown
    UNKNOWN_3 = "0x501bbaec", //get time unknown
    EARNED = "0x008cc262",
    OWNER_OF_TOKEN_ID = "0x0eb9441f",
    TOKENS_OF_OWNER = "0x8462151c",
    USER_HASH_RATE = "0x73776e05",
    GET_TOKEN_ID_USER_BY_INDEX = "0x2f745c59",
    TEST = "0x501bbaec"
}
