require("dotenv").config();
const fs = require("fs");
const { exit } = require("process");
const getEmptyIndexs = require("../utils/create/getEmptyIndexs");
const getAmountUnlist = require("../utils/common/getAmountUnlist");
const { sleep, ranSleep } = require("../utils/common/sleep");

async function sendTxt(gasPrice_, gasLimit_, index_, ids_, prices_, hexData_, nameFile_) {
    const Private_Key = process.env.PRIVATE_KEY_CHANGE;
    const Web3 = require("web3");
    const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.bnbchain.org"));
    acc = web3.eth.accounts.privateKeyToAccount(Private_Key);
    console.log(acc.address);
    const abi = JSON.parse(fs.readFileSync("./abi/abiMobox.json"));
    const contract = new web3.eth.Contract(abi, consractAddress);
    // console.log(contract)
    emptyVar = [];
    // console.log(ids,prices)
    // asd
    tx = "";
    encoded = "";
    signArray = "";
    if (hexData_.length == 0) {
        encoded = contract.methods
            .createAuctionBatch(index_, emptyVar, emptyVar, ids_, prices_)
            .encodeABI();
    } else {
        encoded = hexData_;
    }
    tx = {
        from: acc.address,
        gas: gasLimit_,
        gasPrice: gasPrice_ * 10 ** 9, // + i * 10 ** 6,
        to: consractAddress,
        value: 0,
        data: encoded,
    };
    await web3.eth.accounts.signTransaction(tx, Private_Key).then((signed) => {
        signArray = signed;
        // console.log(Date());
    });
    console.log("Listing");
    try {
        let createAuctionBatch = await web3.eth.sendSignedTransaction(signArray.rawTransaction);
        console.log("Done at block:", createAuctionBatch.blockNumber);
        boolSell = "TRUE";
    } catch (error) {
        console.log("Over time or fail during list!");
        console.log(error);
        exit();
    }
}

async function createBatch(gasPrice_, gasLimit_, hexData_, nameFile_) {
    let count = 0;
    indexs = await getEmptyIndexs(consractAddress);
    const amountUnList = await getAmountUnlist(consractAddress);
    if (amountUnList == 0 || amountUnList != ids[0].length) {
        console.log("No listing");
        console.log("amountUnList:", amountUnList);
        // exit();
    }
    while (true) {
        if (indexs.length != ids.length || indexs.length != prices.length || indexs[0] == 999) {
            console.log("Length array not same!");
            break;
        }
        if (hexData_.length > 0) {
            await sendTxt(gasPrice_, gasLimit_, "", "", "", hexData_, nameFile_);
            break;
        }
        for (let index = 0; index < indexs.length; index++) {
            if (indexs[index] != undefined) {
                boolSell = "FALSE";
                console.log(indexs[index], ids[index], prices[index]);
                await sendTxt(
                    gasPrice_,
                    gasLimit_,
                    indexs[index],
                    ids[index],
                    prices[index],
                    "",
                    nameFile_
                );
                if (boolSell == "TRUE") {
                    indexs[index] = undefined;
                    count += 1;
                }
            }
            await sleep(5000);
        }
        if (count >= indexs.length) {
            console.log("Done");
            break;
        }
        await sleep(5000);
    }
}

indexs = [10];
ids = [["13024", "13026", "13042", "13049", "13052", "13052"]];
prices = [["4.297", "3.892", "4.499", "4.179", "3.879", "3.879"]];

console.log(indexs.length, ids.length, prices.length);
for (let ii = 0; ii < prices.length; ii++) {
    for (let jj = 0; jj < prices[ii].length; jj++) {
        prices[ii][jj] = Math.round(Number(prices[ii][jj]) * 10 ** 5).toString() + "0000000000000";
    }
}
const consractAddress = "0x88888df23f9554e4b043b00e1f4afb39fc078888";
createBatch(1.1001, 1000000, "", "_1_0_1");
