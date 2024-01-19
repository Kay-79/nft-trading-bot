require("dotenv").config();
const configJson = require("../config/config");
const fs = require("fs");
const { sleep, ranSleep } = require("../utils/common/sleep");
const Web3 = require("web3");
const { exit } = require("process");
const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org"));
const abi = JSON.parse(fs.readFileSync("./abi/abiMobox.json"));
const abiBUSD = require("../abi/abiERC20");
const addressToken = configJson.addressToken;
const contractToken = new web3.eth.Contract(abiBUSD, addressToken);
const myAcc = configJson.myAcc;
const Private_Key = process.env.PRIVATE_KEY_BID;

async function transfer(address_) {
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
    let cacheTransfer = 0;
    for (let index = 0; index < myAcc.length; index++) {
        let isContract = await web3.eth.getStorageAt(myAcc[index][0]);
        if (!Number(isContract) || myAcc[index][0] == address_) {
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
                    .transferERC20(addressToken, address_, balanceSC.toString())
                    .encodeABI();
                let tx = {
                    gas: 100000,
                    gasPrice: 3.001 * 10 ** 9,
                    to: myAcc[index][0],
                    value: 0,
                    data: encoded,
                };
                let signed = await web3.eth.accounts.signTransaction(tx, Private_Key);
                await web3.eth.sendSignedTransaction(signed.rawTransaction);
                console.log(
                    "Tranfer " +
                        (balanceSC / 10 ** 18).toFixed(2).toString() +
                        "USDT from " +
                        myAcc[index][0] +
                        " to " +
                        address_
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
const maxTransfer = 900;

transfer("0xA6fBE2809210CC38255959a86EC5eA13f91B636A");
