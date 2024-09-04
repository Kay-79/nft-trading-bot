require("dotenv").config();
const fs = require("fs");
const Web3 = require("web3");
const { exit } = require("process");
const configJson = require("../../config/config");
const web3 = new Web3(new Web3.providers.HttpProvider(configJson.rpcs.create));
const { abiCheckListed, abiCheckBided } = require("../../abi/abiCheckUnlist");
const getBlockByTime = require("../bid/getBlockByTime");
const { sleep } = require("../common/sleep");
let momoStorage = {};
let dataBid = {};
const fiveDaysBlock = 144000;

const syncInventory = async (endBlock, nowBlock, addressCheck) => {
    if (endBlock > nowBlock) {
        return;
    }
    const cacheBlock = endBlock;
    console.log(
        `Syncing inventory: ${cacheBlock}/${nowBlock}... blocks in queue: ${nowBlock - cacheBlock}`
    );
    try {
        let data = [];
        try {
            let toBlockNew = endBlock + configJson.limitBlockUpdate;
            data = await web3.eth.getPastLogs({
                address: [process.env.ADDRESS_MP, process.env.ADDRESS_MOMO],
                fromBlock: endBlock,
                toBlock: toBlockNew,
                topics: [
                    process.env.TOPIC_BID,
                    process.env.TOPIC_CREATE,
                    process.env.TOPIC_CANCEL,
                    process.env.TOPIC_HASH
                ] // the second parameter is variable c
            });
        } catch (err) {
            console.warn(err.message);
            await sleep(5000);
            await syncInventory(cacheBlock, nowBlock, addressCheck);
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i].topics[2] === addressCheck) {
                const decodedData = await web3.eth.abi.decodeParameters(
                    abiCheckBided,
                    data[i].data
                );
                for (let j = 0; j < decodedData.ids.length; j++) {
                    if (dataBid[decodedData.ids[j]] === undefined) {
                        dataBid[decodedData.ids[j]] = Number(decodedData.amounts[j]);
                    } else {
                        dataBid[decodedData.ids[j]] += Number(decodedData.amounts[j]);
                    }
                }
            }
        }
        if (!data.length) {
            console.log(`data length: ${data.length} ==> continue scan bid`);
            await syncInventory(cacheBlock + configJson.limitBlockUpdate, nowBlock, addressCheck);
        }
        if (cacheBlock + configJson.limitBlockUpdate < nowBlock) {
            if (Number(data[data.length - 1].blockNumber) < nowBlock) {
                await syncInventory(
                    Number(data[data.length - 1].blockNumber) + 1,
                    nowBlock,
                    addressCheck
                );
            }
        }
    } catch (error) {
        console.warn(error);
    }
};

const updateInventory = async boolSaveInventory => {
    momoStorage = require("../../data/inventory.json");
    for (let i = 0; i < momoStorage.contracts.length; i++) {
        const hexAddress = `0x000000000000000000000000${momoStorage.contracts[i].contractAddress
            .toLowerCase()
            .slice(2)}`;
        momoStorage.contracts[i].hexAddress = hexAddress;
    }
    console.log(`Last date: ${JSON.stringify(momoStorage)}`);
    console.log(`Last block synced: ${momoStorage.syncedBlock}`);
    const nowBlock = await getBlockByTime(web3, (Date.now() / 1000 - 10).toFixed(0), 1);
    console.log(`Now block is: ${nowBlock}`);
    const dataBlock = momoStorage["syncedBlock"] + 1;
    await syncInventory(dataBlock, nowBlock, momoStorage);
    let momoUnlist = [];
    let amountMomos = 0;
    let hashRate = 0;
    for (let i = 10000; i < 40000; i++) {
        if (dataBid[i]) {
            amountMomos += Number(dataBid[i]);
            switch (i.toString().slice(0, 1)) {
                case "1":
                    hashRate += 1;
                    break;
                case "2":
                    hashRate += 2;
                    break;
                case "3":
                    hashRate += 3;
                    break;
                default:
                    break;
            }
            for (let j = 0; j < dataBid[i]; j++) {
                momoUnlist.push(`${i}`);
            }
        }
        if (Number(dataBid[i]) == 0) {
            delete dataBid[i];
        }
    }
    // console.log(`Have ${momoUnlist.length} momos unlist in ${addressCheck}`);
    // console.log(momoUnlist.toString());
    // momoStorage[addressCheck]["momo"] = dataBid;
    // momoStorage[addressCheck]["block"] = nowBlock;
    // momoStorage[addressCheck]["hash"] = hashRate;
    // momoStorage[addressCheck]["amount"] = amountMomos;
    nowBlock = await getBlockByTime(web3, (Date.now() / 1000 - 10).toFixed(0), 1);
    if (boolSaveInventory) {
        fs.writeFileSync("./data/momoStorage.json", JSON.stringify(momoStorage));
    }
    await sleep(1000);
    return momoUnlist;
};
const test = async () => {
    const data = await web3.eth.getPastLogs({
        address: [process.env.ADDRESS_MP, process.env.ADDRESS_MOMO],
        fromBlock: 41693900,
        toBlock: 41693902
        // topics: [
        //     process.env.TOPIC_BID,
        //     process.env.TOPIC_CREATE,
        //     process.env.TOPIC_CANCEL,
        //     process.env.TOPIC_HASH
        // ] // the second parameter is variable c
    });
    console.log(`data: ${JSON.stringify(data)}`);
};
test();
// updateInventory(false);
// module.exports = { updateInventory };
