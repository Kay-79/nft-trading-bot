require("dotenv").config();
const fs = require("fs");
const { exit } = require("process");
const config = require("../config/config");
async function sendTxt(addressSC, gasPrice_, gasLimit_, index_, prices_) {
    const Private_Key = process.env.PRIVATE_KEY_BID_PRO_MAINNET;
    const Web3 = require("web3");
    const web3 = new Web3(new Web3.providers.HttpProvider(config.rpcs.check));
    acc = web3.eth.accounts.privateKeyToAccount(Private_Key);
    console.log(acc.address);
    const abi = JSON.parse(fs.readFileSync("./src/abi/abiGEM.json"));
    const contract = new web3.eth.Contract(abi, addressSC);
    emptyVar = [];
    tx = "";
    encoded = "";
    signArray = "";
    encoded = contract.methods.changePrice(index_, prices_).encodeABI();
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
        console.log("Over time or fail during change!");
        exit();
    }
}

const getIndexs = async address => {
    await sendTxt(address, 1.0001, 60000, "722110", "9900000000000000000");
};
getIndexs("0x819e97C7Da2C784403B790121304DB9E6a038dE9");
