import { InventoryType } from "@/enum/enum";

export interface InventoryDto {
    id: string;
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
    prototype: number;
}
