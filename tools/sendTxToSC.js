require("dotenv").config();
const Web3 = require("web3");
const fs = require("fs");
const web3 = new Web3("https://bsc-dataseed3.bnbchain.org");
const abiMobox = JSON.parse(fs.readFileSync("./abi/abiMobox.json", "utf8"));
const contract = new web3.eth.Contract(abiMobox, "0x88888dF23F9554e4B043B00E1F4AfB39Fc078888");

const sendTxToSC = async () => {
    const tx = {
        to: "0x88888dF23F9554e4B043B00E1F4AfB39Fc078888",
        data: contract.methods.changeAmountUnList("6").encodeABI(),
        value: 0,
        gas: 100000,
        gasPrice: 3000000000,
    };
    const signed = await web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY_BID);
    await web3.eth.sendSignedTransaction(signed.rawTransaction);
};
sendTxToSC();
