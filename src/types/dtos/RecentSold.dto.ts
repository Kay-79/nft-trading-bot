import { Momo721 } from "./Momo721";

export interface RecentSold {
    auctor?: string;
    bidder?: string;
    bidPrice?: number;
    ids?: string[];
    amounts?: string[];
    tx?: string;
    crtime?: number;
    tokens?: Momo721[];
}
