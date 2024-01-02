const abiCheckListed = [
    { internalType: "uint256", name: "startPrice", type: "uint256" },
    { internalType: "uint256", name: "endPrice", type: "uint256" },
    { internalType: "uint256", name: "durationDays", type: "uint256" },
    { internalType: "uint256", name: "index", type: "uint256" },
    { internalType: "uint256", name: "tokenId", type: "uint256" },
    { internalType: "uint256[]", name: "ids", type: "uint256[]" },
    { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
    { internalType: "uint256", name: "startTime", type: "uint256" },
];
const abiCheckBided = [
    { internalType: "uint256", name: "bidPrice", type: "uint256" },
    { internalType: "uint256", name: "index", type: "uint256" },
    { internalType: "uint256", name: "tokenId", type: "uint256" },
    { internalType: "uint256[]", name: "ids", type: "uint256[]" },
    { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
    { internalType: "uint256", name: "startTime", type: "uint256" },
];
const abiAmount = [
    {
        inputs: [],
        name: "amountUnList",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
];
module.exports = {
    abiCheckListed,
    abiCheckBided,
    abiAmount,
};
