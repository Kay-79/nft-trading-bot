import { Momo721 } from "./Momo721";

export interface Inventory {
    prototype?: string;
    owner?: string;
    amount?: number;
    tokenId?: number;
    quality?: number;
    category?: number;
    level?: number;
    specialty?: number;
    hashrate?: number;
    lvHashrate?: number;
    tokens?: Momo721[];
}
