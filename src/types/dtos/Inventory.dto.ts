import { InventoryType } from "@/enum/enum";
import { Momo721 } from "./Momo721";

export interface InventoryDto {
    prototype: number;
    type?: InventoryType;
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
