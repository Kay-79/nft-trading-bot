require("dotenv").config();
const configJson = require("../config/config");
const fs = require("fs");
const { sleep, ranSleep } = require("../utils/common/sleep");
const Web3 = require("web3");
const { exit } = require("process");
const abi = JSON.parse(fs.readFileSync("./abi/abiMobox.json"));
const abiBUSD = require("../abi/abiERC20");
const sortPerBudget = require("../utils/common/sortPerBudget");
const addressToken = configJson.addressToken;
let myAcc = configJson.myAcc;
const Private_Key = process.env.PRIVATE_KEY_BID;
const walletAddress = configJson.wallet.address;
let web3;
try {
    web3 = new Web3(new Web3.providers.HttpProvider(configJson.rpcs.public));
} catch (error) {
    web3 = new Web3(new Web3.providers.HttpProvider(configJson.rpcs.change));
}
const contractToken = new web3.eth.Contract(abiBUSD, addressToken);

async function transfer() {
    myAcc = await sortPerBudget(myAcc, contractToken);
    let cacheTransfer = 0;
    let isContract = await web3.eth.getStorageAt(walletAddress);
    if (!Number(isContract)) {
        console.log("Wallet is not contract");
        return; // dont send token from address to contract
    }
    for (let index = 0; index < myAcc.length; index++) {
        let isContract = await web3.eth.getStorageAt(myAcc[index][0]);
        if (!Number(isContract)) {
            continue; // dont send token from address to contract
        }
        let balanceSC = await contractToken.methods.balanceOf(myAcc[index][0]).call();
        console.log(myAcc[index][0]);
        console.log(balanceSC / 10 ** 18);
        if (balanceSC / 10 ** 18 > minTransfer) {
            if (cacheTransfer + balanceSC / 10 ** 18 > maxTransfer) {
                balanceSC = Number(
                    (Number((maxTransfer - cacheTransfer).toFixed(2)) * 10 ** 18).toFixed(0)
                );
                if (balanceSC < minTransfer) {
                    console.log("Zero Transfer");
                    break;
                }
                await sleep(100);
            }
            cacheTransfer += balanceSC / 10 ** 18;
            try {
                const contractAddress = new web3.eth.Contract(abi, myAcc[index][0]);
                let encoded = await contractAddress.methods
                    .transferERC20(addressToken, walletAddress, balanceSC.toString())
                    .encodeABI();
                let tx = {
                    gas: 100000,
                    gasPrice: 1.0001 * 10 ** 9,
                    to: myAcc[index][0],
                    value: 0,
                    data: encoded,
                };
                let signed = await web3.eth.accounts.signTransaction(tx, Private_Key);
                if (walletAddress != "0x444444961B7CC7b0F23BCF1bC666facf44135DA2") {
                    console.warn("Please check wallet address");
                    exit();
                }
                await web3.eth.sendSignedTransaction(signed.rawTransaction);
                console.log(
                    "Tranfer " +
                        (balanceSC / 10 ** 18).toFixed(2).toString() +
                        "USDT from " +
                        myAcc[index][0] +
                        " to " +
                        walletAddress
                );
            } catch (error) {
                console.log("Encode Fail", error);
            }
            if (cacheTransfer >= maxTransfer) {
                console.log("Done transfer max", maxTransfer);
                exit();
            }
        }
    }
}

const minTransfer = 10;
const maxTransfer = 100;

transfer();
