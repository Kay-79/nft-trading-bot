const fs = require("fs");
const configJson = require("../../config/config");
const { exit } = require("process");
const axios = require("axios");
const getAmountUnlist = require("../common/getAmountUnlist");
const { sleep } = require("../common/sleep");
const myaccs = configJson.myAcc;
const updateZeroBlock = async () => {
    let newDataZero = "";
    let contracts = myaccs.map((e) => e[0]);
    let nowBlock = await axios
        .get(
            `https://api.bscscan.com/api?module=block&action=getblocknobytime&timestamp=${(
                Date.now() / 1000
            ).toFixed()}&closest=before&apikey=${process.env.BSC_API_KEY}`
        )
        .catch((e) => {
            console.log("Err check block!!");
            exit();
        });
    nowBlock = nowBlock.data.result;
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
