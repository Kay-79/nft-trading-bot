export enum BidType {
    NORMAL = "NORMAL", //✅
    BUNDLE = "BUNDLE", //✅
    PRO = "PRO", //✅
    GROUP = "GROUP", // 🧑‍💻
    BOX = "BOX", // 🔜
    MECBOX = "MECBOX", // 🔜
    GEM = "GEM" // 🔜
}

export enum MomoType {
    NORMAL = "NORMAL",
    PRO = "PRO"
}

export enum BlockType {
    BEP721 = 0,
    CREW = 1
}

export enum PredictMode {
    ALL = "ALL",
    ONE = "ONE"
}

export enum AuctionStatus {
    ACTIVE = 3,
    FINISHED = 2,
    CANCELLED = 1
}

export enum AuctionGroupStatus {
    ACTIVE = 3,
    FINISHED = 2,
    CANCELLED = 1
}

export enum Environment {
    TESTNET = "TESTNET",
    MAINNET = "MAINNET"
}

export enum ModeBotStatus {
    ENABLE = "☑️",
    DISABLE = "🚫"
}

export enum FunctionFragment {
    BID = "bid(address,uint256,uint256,uint256)",
    BID_BLOCK = "bidBlock(address,uint256,uint256,uint256)",
    BID_BATCH = "bid(address[],uint256[],uint256[],uint256[],bool)",
    CHANGE_PRICE = "changePrice(uint256,uint256,uint256,uint256)"
}

export enum BidStatus {
    SUCCESS = "✅",
    FAILED = "❌"
}

export enum StakingSelector {
    UNKNOWN_1 = "0x390c5f07", //unknow function selector
    UNKNOWN_2 = "0xd1728859", //get time unknown
    EARNED = "0x008cc262",
    OWNER_OF_TOKEN_ID = "0x0eb9441f",
    TOKENS_OF_OWNER = "0x8462151c",
    USER_HASH_RATE = "0x73776e05",
    GET_TOKEN_ID_USER_BY_INDEX = "0x2f745c59",
    GET_ADDRESS_TOP_BY_UNKNOWN_INDEX = "0x501bbaec",
    GET_USER_REWARD_INFO = "0x69517310",
    USER_MOMO721_STAKE = "0x90786351",
    TEST = "0x75481cff"
}

export enum MpSelector {
    GET_SUGGEST_INDEX = "0xd28cc5f0",
    GET_LISTED_MOMOS = "0xcbbac767",
    GET_ORDER = "0xedb25841",
    CREATE_AUCTION_BATCH = "0x4213cec7",
    CREATE_AUCTION = "0xd87ccd58",
    EXECUTE = "0xb61d27f6",
}

export enum MpBlockSelector {
    GET_LISTED_MOMOS = "0xcbbac767",
    GET_ORDER = "0xedb25841"
}

export enum Momo721Selector {
    GET_MOMO1155_ADDRESS = "0x8d2df48f",
    GET_MEC_TOKEN_ADDRESS = "0xdbf4025b",
    GET_MOMO_INFO = "0xc282c1ea",
    GET_PROTOTYPE_HASH_TIME = "0x3323889a",
    GET_APPROVED = "0x081812fc",
    GET_PROTOTYPE_HASH = "0x74498169",
    TOKENS_OF_OWNER = "0x8462151c",
    BALANCE_OF = "0x70a08231",
    TOKENS_OF_OWNER_BY_INDEX = "0x2f745c59",
    TOKEN_BY_INDEX = "0x4f6ccce7",
    OWNER_OF = "0x6352211e",
    GET_EQUIPMENT_MOMO = "0x205ead31"
}

export enum MintMomoSelector {
    TEST = "0xa3beba1e"
}

export enum Momo1155Selector {
    TEST = "0x0e89341c"
}

export enum BulkAction {
    ADD = "ADD",
    REMOVE = "REMOVE",
    UPDATE = "UPDATE",
    CLEAR = "CLEAR"
}

export enum CartAction {
    ADD = "ADD",
    REMOVE = "REMOVE",
    UPDATE = "UPDATE",
    CLEAR = "CLEAR"
}
