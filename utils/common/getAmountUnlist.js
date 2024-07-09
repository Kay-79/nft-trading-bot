const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.binance.org"));
const abiAmount = [
    {
        inputs: [],
        name: "amountUnList",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function"
    }
];

const getAmountUnlist = async address => {
    const contract = new web3.eth.Contract(abiAmount, address);
    return await contract.methods.amountUnList().call();
};

module.exports = getAmountUnlist;
