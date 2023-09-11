const fs = require("fs");
const { exit } = require("process");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
async function sendTxt(gasPrice_, gasLimit_, index_, prices_) {
  try {
    const inputdata = fs.readFileSync("myAccount_1_0_1.txt", "utf8");
    myAccount = inputdata.split("\n");
    // console.log(myAccount[1])
  } catch (err) {
    console.error(err);
  }
  const Private_Key = myAccount[1];
  const Web3 = require("web3");
  const web3 = new Web3(
    new Web3.providers.HttpProvider("https://bsc-dataseed4.binance.org")
  );
  acc = web3.eth.accounts.privateKeyToAccount(Private_Key);
  console.log(acc.address);
  const abi = JSON.parse(fs.readFileSync("./config/abiMobox.json"));
  const contract = new web3.eth.Contract(abi, consractAddress);
  // console.log(contract)
  emptyVar = [];
  // console.log(ids,prices)
  // asd
  tx = "";
  encoded = "";
  signArray = "";
  encoded = contract.methods
    .changePrice(index_, prices_, prices_, "2")
    .encodeABI();
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
    let createAuctionBatch = await web3.eth.sendSignedTransaction(
      signArray.rawTransaction
    );
    console.log("Done at block:", createAuctionBatch.blockNumber);
    boolSell = "TRUE";
  } catch (error) {
    console.log("Over time or fail during list!");
    exit();
  }
}

const consractAddress = "0xa2b607197c1A1f5FF114915c407FDDAbe3EF67E1";
sendTxt(3.001, 1000000, "68", "12900000000000000000");
