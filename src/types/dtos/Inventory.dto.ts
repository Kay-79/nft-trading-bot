import { InventoryType } from "@/enum/enum";

export interface InventoryDto {
    id: string;
    prototype: number;
    owner?: string;
    type?: InventoryType;
    amount?: number;
    tokenId?: number;
    quality?: number;
    category?: number;
    level?: number;
    specialty?: number;
    hashrate?: number;
    lvHashrate?: number;
}
