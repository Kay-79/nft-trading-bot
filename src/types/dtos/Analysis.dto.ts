import { MomoType } from "@/enum/enum";

export interface AnalysisDto {
    id: MomoType;
    totalBid: number;
    totalSell: number;
    countBid: number;
    countSell: number;
    countChange: number;
    countCancel: number;
}
