/**
 * Shortens a number to a more readable format.
 * @param value - The number to shorten.
 * @param decimals - The number of decimals to shorten to.
 * @param round - The number of decimals to round to.
 * @returns The shortened number, type number.
 */
export const shortenNumber = (value: number, decimals: number, round: number): number => {
    const result = value / 10 ** decimals;
    return Number(result.toFixed(round).replace(/\.?0*$/, ""));
};

/**
 * Shortens an Ethereum address to a more readable format.
 * @param address - The Ethereum address to shorten.
 * @returns The shortened address as a string.
 */
export const shortenAddress = (address: string): string => {
    if (address.length <= 10) {
        return address;
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
