import { MomoType } from "@/enum/enum";

export interface AnalysisDto {
    id: MomoType;
    totalBid: number;
    totalSell: number;
    countBid: number;
    countSold: number;
    countChange: number;
    countCancel: number;
}
