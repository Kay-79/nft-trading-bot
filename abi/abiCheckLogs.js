const abiCheckListed = [
    { internalType: "uint256", name: "startPrice", type: "uint256" },
    { internalType: "uint256", name: "endPrice", type: "uint256" },
    { internalType: "uint256", name: "durationDays", type: "uint256" },
    { internalType: "uint256", name: "index", type: "uint256" },
    { internalType: "uint256", name: "tokenId", type: "uint256" },
    { internalType: "uint256[]", name: "ids", type: "uint256[]" },
    { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
    { internalType: "uint256", name: "startTime", type: "uint256" }
];
const abiCheckBided = [
    { internalType: "uint256", name: "bidPrice", type: "uint256" },
    { internalType: "uint256", name: "index", type: "uint256" },
    { internalType: "uint256", name: "tokenId", type: "uint256" },
    { internalType: "uint256[]", name: "ids", type: "uint256[]" },
    { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
    { internalType: "uint256", name: "startTime", type: "uint256" }
];
const abiCheckChange = [
    { internalType: "uint256", name: "startPrice", type: "uint256" },
    { internalType: "uint256", name: "endPrice", type: "uint256" },
    { internalType: "uint256", name: "durationDays", type: "uint256" },
    { internalType: "uint256", name: "index", type: "uint256" },
    { internalType: "uint256", name: "oldStartTime", type: "uint256" },
    { internalType: "uint256", name: "newStartTime", type: "uint256" }
];
const abiCheckCanceled = [
    { internalType: "uint256", name: "index", type: "uint256" },
    { internalType: "uint256", name: "tokenId", type: "uint256" },
    { internalType: "uint256[]", name: "ids", type: "uint256[]" },
    { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
    { internalType: "uint256", name: "startTime", type: "uint256" }
];

const abiCheckZeroHash = [
    { internalType: "uint256", name: "index", type: "uint256" },
    { internalType: "uint256", name: "preHash", type: "uint256" },
    { internalType: "uint256", name: "lastHash", type: "uint256" }
];

module.exports = {
    abiCheckListed,
    abiCheckBided,
    abiCheckCanceled,
    abiCheckChange,
    abiCheckZeroHash
};
