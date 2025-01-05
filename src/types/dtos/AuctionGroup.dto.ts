import { Momo721 } from "./Momo721";

export interface AuctionGroupDto {
    orderId?: number;
    auctor?: string;
    type?: number;
    uptime?: number;
    price?: number;
    hashrate?: number;
    tokens?: Momo721[];
    tx?: string;
    index?: number;
}
