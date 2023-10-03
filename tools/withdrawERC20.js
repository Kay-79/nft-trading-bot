const fs = require("fs");
const Web3 = require("web3");
const { exit } = require("process");
const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org"));
const abi = [
    {
        constant: true,
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "contract IERC20", name: "token", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transferERC20",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
const contractBUSD = new web3.eth.Contract(abi, "0x55d398326f99059ff775485246999027b3197955");
const configJson = JSON.parse(fs.readFileSync("./config/config.json"));
const myAcc = configJson.myAcc;
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
try {
    const passData = fs.readFileSync("myAccount_5_8_1.txt", "utf8");
    myAccount = passData.split("\n");
} catch (err) {
    console.error(err);
    exit();
}
const Private_Key = myAccount[1];

async function withdrawTo(address_) {
    let checkMyAcc = false;
    for (let index = 0; index < myAcc.length; index++) {
        if (myAcc[index][0] == address_) {
            checkMyAcc = true;
        }
    }
    if (!checkMyAcc) {
        console.log("Owner address is not you!");
        exit();
    }
    let cacheWithdraw = 0;
    for (let index = 0; index < myAcc.length; index++) {
        let isContract = await web3.eth.getStorageAt(myAcc[index][0]);
        if (!Number(isContract) || myAcc[index][0] == address_) {
            continue; // dont send token from address to contract
        }
        let balanceSC = await contractBUSD.methods.balanceOf(myAcc[index][0]).call();
        console.log(myAcc[index][0]);
        console.log(balanceSC / 10 ** 18);
        if (balanceSC / 10 ** 18 > minWithdraw) {
            if (cacheWithdraw + balanceSC / 10 ** 18 > maxWithdraw) {
                balanceSC = Number((Number((maxWithdraw - cacheWithdraw).toFixed(2)) * 10 ** 18).toFixed(0));
                await sleep(100);
            }
            cacheWithdraw += balanceSC / 10 ** 18;
            try {
                const contractAddress = new web3.eth.Contract(abi, myAcc[index][0]);
                let encoded = await contractAddress.methods.transferERC20("0x55d398326f99059ff775485246999027b3197955", address_, balanceSC.toString()).encodeABI();
                var tx = {
                    gas: 100000,
                    gasPrice: 3.001 * 10 ** 9,
                    to: myAcc[index][0],
                    value: 0,
                    data: encoded,
                };
                let signed = await web3.eth.accounts.signTransaction(tx, Private_Key);
                await web3.eth.sendSignedTransaction(signed.rawTransaction);
                console.log("Tranfer " + (balanceSC / 10 ** 18).toFixed(2).toString() + "BUSD from " + myAcc[index][0] + " to " + address_);
            } catch (error) {
                console.log("Encode Fail", error);
            }
            if (cacheWithdraw >= maxWithdraw) {
                console.log("Done withdraw max", maxWithdraw);
                exit();
            }
        }
    }
}

const minWithdraw = 10;
const maxWithdraw = 999;

withdrawTo("0x73A4AbD430C821B49423dB5279fb56ee72073292");
