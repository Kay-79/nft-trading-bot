export enum AuctionType {
    NORMAL = "NORMAL",
    BUNDLE = "BUNDLE",
    PRO = "PRO"
}

export enum Enviroment {
    TESTNET = "TESTNET",
    MAINNET = "MAINNET"
}

export enum FunctionFragment {
    BID = "bid(address,uint256,uint256,uint256)",
    BID_BATCH = "bid(address[],uint256[],uint256[],uint256[],bool)"
}

export enum AuctionStatus {
    SUCCESS = "✅",
    FAILED = "❌"
}
