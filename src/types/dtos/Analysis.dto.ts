interface TradeTransactionNormal {
    amountBuy: number;
    valueBuy: number;
    amountSell: number;
    valueSell: number;
    countChange: number;
    countCancel: number;
}

interface TradeTransactionPro {
    amount: number;
    value: number;
}

export interface AnalysisDto {
    normal: {
        totalBuy: TradeTransactionNormal;
        totalSell: TradeTransactionNormal;
        totalCancel: TradeTransactionNormal;
    };
    pro: {
        totalBuy: TradeTransactionPro;
        totalSell: TradeTransactionPro;
        totalCancel: TradeTransactionPro;
    };
}
