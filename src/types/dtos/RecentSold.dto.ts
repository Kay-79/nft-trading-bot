import { Momo721 } from "./Momo721";

export interface RecentSoldDto {
    auctor?: string;
    bidder?: string;
    type?: number;
    bidPrice?: number;
    ids?: string[];
    amounts?: string[];
    tx?: string;
    crtime?: number;
    tokens?: Momo721[];
}
