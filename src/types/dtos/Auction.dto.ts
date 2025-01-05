export interface AuctionDto {
    id?: string;
    chain?: string;
    auctor?: string;
    startPrice?: number;
    endPrice?: number;
    durationDays?: number;
    index?: number;
    ids?: string[] | undefined;
    amounts?: string[] | undefined;
    tokenId?: number;
    uptime?: number;
    prototype?: number;
    hashrate?: number;
    lvHashrate?: number;
    level?: number;
    specialty?: number;
    category?: number;
    quality?: number;
    tx?: string;
    deleted?: boolean | null;
    nowPrice?: number | undefined;
}
