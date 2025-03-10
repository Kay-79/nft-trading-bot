interface TradeTransaction {
    amount: number;
    value: number;
}

export interface AnalysisDto {
    normal: {
        totalBuy: TradeTransaction;
        totalSell: TradeTransaction;
        totalCancel: TradeTransaction;
    };
    pro: {
        totalBuy: TradeTransaction;
        totalSell: TradeTransaction;
        totalCancel: TradeTransaction;
    };
}
