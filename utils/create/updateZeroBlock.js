const fs = require("fs");
const configJson = require("../../config/config");
const { exit } = require("process");
const axios = require("axios");
const getAmountUnlist = require("../common/getAmountUnlist");
const { sleep } = require("../common/sleep");
const myaccs = configJson.myAcc;
const Web3 = require("web3");
const web3 = new Web3(configJson.rpcs.change);
const updateZeroBlock = async () => {
    let newDataZero = "";
    let contracts = myaccs.map((e) => e[0]);
    let nowBlock = await Web3.eth.getBlockNumber();
    // nowBlock = nowBlock.data.result;
    console.log(nowBlock);
    let lastContract = "";
    try {
        const data = fs.readFileSync("./data/zeroBlock.csv", "utf8");
        const dataArr = data.split("\n");
        for (let i = 0; i < dataArr.length; i++) {
            let dataAddress = dataArr[i].split("|");
            lastContract = dataAddress[0];
            const amountUnlist = await getAmountUnlist(dataAddress[0]);
            if (amountUnlist === "0") {
                dataAddress[1] = nowBlock;
            }
            newDataZero += `${dataAddress[0]}|${dataAddress[1]}\n`;
        }
        let flagSaveNewContract = false;
        for (let i = 0; i < contracts.length; i++) {
            if (lastContract === contracts[i]) {
                flagSaveNewContract = true;
                continue;
            }
            if (flagSaveNewContract) {
                newDataZero += `${contracts[i]}|${nowBlock}\n`;
            }
        }
        // last '\n' remove
        newDataZero = newDataZero.trim();
        fs.writeFileSync("./data/zeroBlock.csv", newDataZero);
        await sleep(1000);
    } catch (error) {
        console.log("Update with real device!!");
        exit();
    }
};

module.exports = { updateZeroBlock };
// updateZeroBlock();
