export interface ChangeDto {
    id: string;
    startPrice: number;
    endPrice: number;
    durationDays: number;
    index: number;
    oldStartTime: number;
    newStartTime: number;
}
