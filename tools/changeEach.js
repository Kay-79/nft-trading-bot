require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
const { exit } = require("process");
async function sendTxt(addressSC, gasPrice_, gasLimit_, index_, prices_) {
    const Private_Key = process.env.PRIVATE_KEY_CHANGE;
    const Web3 = require("web3");
    const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed4.binance.org"));
    acc = web3.eth.accounts.privateKeyToAccount(Private_Key);
    console.log(acc.address);
    const abi = JSON.parse(fs.readFileSync("./abi/abiMobox.json"));
    const contract = new web3.eth.Contract(abi, addressSC);
    emptyVar = [];
    tx = "";
    encoded = "";
    signArray = "";
    encoded = contract.methods.changePrice(index_, prices_, prices_, "2").encodeABI();
    tx = {
        from: acc.address,
        gas: gasLimit_,
        gasPrice: gasPrice_ * 10 ** 9, // + i * 10 ** 6,
        to: addressSC,
        value: 0,
        data: encoded,
    };
    await web3.eth.accounts.signTransaction(tx, Private_Key).then((signed) => {
        signArray = signed;
    });
    console.log("Listing");
    try {
        let createAuctionBatch = await web3.eth.sendSignedTransaction(signArray.rawTransaction);
        console.log("Done at block:", createAuctionBatch.blockNumber);
        boolSell = "TRUE";
    } catch (error) {
        console.log("Over time or fail during list!");
        exit();
    }
}

const getIndexs = async (address) => {
    //     let indexs = [];
    //     let response = await axios.get("https://nftapi.mobox.io/auction/list/BNB/" + address + "?sort=-time&page=1&limit=128").catch((e) => {
    //         console.log("Err1");
    //     });
    //     response = response.data.list;
    //     console.log(response);
    //     for (let i = 0; i < response.length; i++) {
    //         await sendTxt(address, 3.001, 1000000, (response[i].index).toString(), "99000000000000000000");
    //         await sleep(20000);
    //     }
    //     console.log(indexs);
    sendTxt(3.001, 1000000, "68", "12900000000000000000");
};
getIndexs("0xa2b607197c1A1f5FF114915c407FDDAbe3EF67E1");
