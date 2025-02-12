export const abiMomo = [
    {
        constant: true,
        inputs: [{ name: "user", type: "address" }],
        name: "earned",
        outputs: [{ name: "earned", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "rewardStartTime",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: true,
        inputs: [
            { name: "owner", type: "address" },
            { name: "index", type: "uint256" }
        ],
        name: "tokenOfOwnerByIndex",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: false,
        inputs: [],
        name: "getReward",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: true,
        inputs: [{ name: "user", type: "address" }],
        name: "getUserRewardInfo",
        outputs: [
            { name: "earned", type: "uint256" },
            { name: "earned", type: "uint256" },
            { name: "earned", type: "uint256" },
            { name: "earned", type: "uint256" }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: true,
        inputs: [{ name: "user", type: "address" }],
        name: "userHashrate",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: true,
        inputs: [{ name: "owner", type: "address" }],
        name: "tokensOfOwner",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
    }
];
