require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
const { exit } = require("process");
const config = require("../config/config");
async function sendTxt(addressSC, gasPrice_, gasLimit_, index_, prices_) {
    const Private_Key = process.env.PRIVATE_KEY_CHANGE_MAINNET;
    const Web3 = require("web3");
    const web3 = new Web3(new Web3.providers.HttpProvider(config.rpcs.check));
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
        data: encoded
    };
    await web3.eth.accounts.signTransaction(tx, Private_Key).then(signed => {
        signArray = signed;
    });
    console.log("Changing");
    try {
        let createAuctionBatch = await web3.eth.sendSignedTransaction(signArray.rawTransaction);
        console.log("Done at block:", createAuctionBatch.blockNumber);
        boolSell = "TRUE";
    } catch (error) {
        console.log("Over time or fail during list!");
        exit();
    }
}

const getIndexs = async address => {
    sendTxt(address, 3.0001, 1000000, "1", "500000000000000000");
};
getIndexs("0x891016f99BA622F8556bE12B4EA336157aA6cb20");
