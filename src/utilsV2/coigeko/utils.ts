export const getTokenPrice = async (symbol: string): Promise<number> => {
    const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`
    );
    const data = await response.json();
    return Number(data[symbol].usd);
};
