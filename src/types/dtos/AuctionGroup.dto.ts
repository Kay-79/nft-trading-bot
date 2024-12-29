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

export class AuctionGroupDto {
    orderId?: number;
    auctor?: string;
    type?: number;
    uptime?: number;
    price?: number;
    hashrate?: number;
    tokens?: Token[];
    tx?: string;
    index?: number;
}
