interface AuctionMode {
    normal: boolean;
    pro: boolean;
    bundle: boolean;
}

interface AuctionGroupMode {
    bep721: boolean;
    crew: boolean;
}

export interface ModeBot {
    auction?: AuctionMode;
    auctionGroup?: AuctionGroupMode;
    box?: boolean;
    mexBox?: boolean;
    gem?: boolean;
}
