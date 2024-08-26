require("dotenv").config();
const fs = require("fs");
const Web3 = require("web3");
const { exit } = require("process");
const configJson = require("../../config/config");
const web3 = new Web3(new Web3.providers.HttpProvider(configJson.rpcs.create));
const { abiCheckZeroHash } = require("../../abi/abiCheckUnlist");
const getBlockByTime = require("../bid/getBlockByTime");
const { sleep } = require("../common/sleep");
let momoStorage = {};
let dataBid = {};
const fiveDaysBlock = 144000;

const getZeroHashBlock = async (endBlock, nowBlock, addressCheck, addressRaw) => {
    const cacheBlock = endBlock;
    console.log(
        `Checking zero hash: ${cacheBlock}/${nowBlock}... blocks in queue: ${nowBlock - cacheBlock}`
    );
    try {
        let data = [];
        try {
            let toBlockNew = endBlock + configJson.limitBlockUpdate;
            data = await web3.eth.getPastLogs({
                address: process.env.ADDRESS_MOMO,
                fromBlock: endBlock,
                toBlock: toBlockNew,
                topics: [process.env.TOPIC_HASH] // the second parameter is variable c
            });
        } catch (err) {
            console.warn(err.message);
            await sleep(5000);
            await getZeroHashBlock(cacheBlock, nowBlock, addressCheck, addressRaw);
        }
        // if (!data) {
        //     await getZeroHashBlock(cacheBlock, nowBlock, addressCheck, addressRaw);
        // }
        // const data = mpListed;
        for (let i = 0; i < data.length; i++) {
            if (data[i].topics[1] === addressCheck) {
                const decodedData = await web3.eth.abi.decodeParameters(
                    abiCheckZeroHash,
                    data[i].data
                );
                if (Number(decodedData.lastHash) === 0) {
                    await saveZeroBlock(addressRaw, Number(data[i].blockNumber));
                }
                // for (let j = 0; j < decodedData.ids.length; j++) {
                //     if (dataBid[decodedData.ids[j]] === undefined) {
                //         dataBid[decodedData.ids[j]] = Number(decodedData.amounts[j]);
                //     } else {
                //         dataBid[decodedData.ids[j]] += Number(decodedData.amounts[j]);
                //     }
                // }
            }
        }
        if (cacheBlock + 2 * configJson.limitBlockUpdate > nowBlock) return;
        if (!data.length) {
            console.log(`data length: ${data.length} ==> continue scan bid`);
            await getZeroHashBlock(
                cacheBlock + configJson.limitBlockUpdate,
                nowBlock,
                addressCheck,
                addressRaw
            );
        }
        if (cacheBlock + 2 * configJson.limitBlockUpdate < nowBlock) {
            if (Number(data[data.length - 1].blockNumber) < nowBlock) {
                await getZeroHashBlock(
                    Number(data[data.length - 1].blockNumber) + 1,
                    nowBlock,
                    addressCheck,
                    addressRaw
                );
            }
        }
    } catch (error) {
        console.warn(error);
    }
    // console.log(`End get momos bid: ${cacheBlock}/${nowBlock}`);
};

const checkZeroHashPrivateNode = async (addressCheck, boolSaveInventory) => {
    momoStorage = require("../../data/momoStorage.json");
    console.log(`Last block checked: ${momoStorage[addressCheck]["latestZeroBlock"]}`);
    dataBid = momoStorage[addressCheck]["momo"];
    const hexAddress = `0x000000000000000000000000${addressCheck.toLowerCase().slice(2)}`;
    let nowBlock = await getBlockByTime(web3, (Date.now() / 1000 - 10).toFixed(0), 1);
    // nowBlock = 38920490
    console.log(`Now block is: ${nowBlock}`);
    if (
        nowBlock - momoStorage[addressCheck]["latestZeroBlock"] < fiveDaysBlock &&
        boolSaveInventory
    ) {
        console.log(`${addressCheck} wait for update after 5 days`);
        return;
    }
    const dataBlock = momoStorage[addressCheck]["latestZeroBlock"] + 1;
    await getZeroHashBlock(dataBlock, nowBlock, hexAddress, addressCheck);
    return momoUnlist;
};
const saveZeroBlock = async (addressCheck, zeroBlock) => {
    momoStorage = require("../../data/momoStorage.json");
    momoStorage[addressCheck]["latestZeroBlock"] = zeroBlock;
    fs.writeFileSync("./data/momoStorage.json", JSON.stringify(momoStorage));
    await sleep(100);
};

module.exports = { checkZeroHashPrivateNode };
