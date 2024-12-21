class Token {
    tokenId?: number;
    quality?: number;
    category?: number;
    level?: number;
    specialty?: number;
    hashrate?: number;
    lvHashrate?: number;
    prototype?: number;
}

export class RecentSold {
    auctor?: string;
    bidder?: string;
    bidPrice?: number;
    ids?: string[];
    amounts?: string[];
    tx?: string;
    crtime?: number;
    tokens?: Token[];
}
