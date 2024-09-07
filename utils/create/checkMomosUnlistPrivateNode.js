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

const getMomosBided = async (endBlock, nowBlock, addressCheck) => {
    if (endBlock > nowBlock) {
        return;
    }
    const cacheBlock = endBlock;
    console.log(
        `Checking bid: ${cacheBlock}/${nowBlock}... blocks in queue: ${nowBlock - cacheBlock}`
    );
    try {
        let data = [];
        try {
            let toBlockNew = endBlock + configJson.limitBlockUpdate;
            data = await web3.eth.getPastLogs({
                address: process.env.ADDRESS_MP,
                fromBlock: endBlock,
                toBlock: toBlockNew,
                topics: [process.env.TOPIC_BID] // the second parameter is variable c
            });
        } catch (err) {
            console.warn(err.message);
            await sleep(5000);
            await getMomosBided(cacheBlock, nowBlock, addressCheck);
        }
        // if (!data) {
        //     await getMomosBided(cacheBlock, nowBlock, addressCheck);
        // }
        // const data = mpListed;
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
        // if (cacheBlock + configJson.limitBlockUpdate > nowBlock) return;
        if (!data.length) {
            console.log(`data length: ${data.length} ==> continue scan bid`);
            await getMomosBided(cacheBlock + configJson.limitBlockUpdate, nowBlock, addressCheck);
        }
        if (cacheBlock + configJson.limitBlockUpdate < nowBlock) {
            if (Number(data[data.length - 1].blockNumber) < nowBlock) {
                await getMomosBided(
                    Number(data[data.length - 1].blockNumber) + 1,
                    nowBlock,
                    addressCheck
                );
            }
        }
    } catch (error) {
        console.warn(error);
    }
    // console.log(`End get momos bid: ${cacheBlock}/${nowBlock}`);
};
const getMomosListed = async (endBlock, nowBlock, addressCheck) => {
    if (endBlock > nowBlock) {
        return;
    }
    const cacheBlock = endBlock;
    console.log(
        `Checking listed: ${cacheBlock}/${nowBlock}... blocks in queue: ${nowBlock - cacheBlock}`
    );
    try {
        let data = [];
        try {
            let toBlockNew = endBlock + configJson.limitBlockUpdate;
            data = await web3.eth.getPastLogs({
                address: process.env.ADDRESS_MP,
                fromBlock: endBlock,
                toBlock: toBlockNew,
                topics: [process.env.TOPIC_CREATE] // the second parameter is variable c
            });
        } catch (error) {
            console.warn(error.message);
            await sleep(5000);
            await getMomosListed(cacheBlock, nowBlock, addressCheck);
        }
        // const data = mpListed;
        for (let ii = 0; ii < data.length; ii++) {
            if (data[ii].topics[1] === addressCheck) {
                const decodedData = await web3.eth.abi.decodeParameters(
                    abiCheckListed,
                    data[ii].data
                );
                for (let j = 0; j < decodedData.ids.length; j++) {
                    if (dataBid[decodedData.ids[j]] === undefined) {
                        console.log("Err scan bid");
                        exit();
                    } else {
                        dataBid[decodedData.ids[j]] -= Number(decodedData.amounts[j]);
                    }
                }
            }
        }
        // console.log(data);
        // if (cacheBlock + configJson.limitBlockUpdate > nowBlock) {
        //     return};
        if (!data.length) {
            console.log(`data length: ${data.length} ==> continue scan listed`);
            await getMomosListed(cacheBlock + configJson.limitBlockUpdate, nowBlock, addressCheck);
        }
        if (cacheBlock + configJson.limitBlockUpdate < nowBlock) {
            if (Number(data[data.length - 1].blockNumber) < nowBlock) {
                await getMomosListed(
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

const checkMomosUnlistPrivateNode = async (addressCheck, boolSaveInventory) => {
    momoStorage = require("../../data/momoStorage.json");
    console.log(`Last block checked: ${momoStorage[addressCheck]["block"]}`);
    dataBid = momoStorage[addressCheck]["momo"];
    const hexAddress = `0x000000000000000000000000${addressCheck.toLowerCase().slice(2)}`;
    let nowBlock = await getBlockByTime(web3, (Date.now() / 1000 - 10).toFixed(0), 1);
    console.log(`Now block is: ${nowBlock}`);
    if (nowBlock - momoStorage[addressCheck]["block"] < fiveDaysBlock && boolSaveInventory) {
        console.log(`${addressCheck} wait for update after 5 days`);
        return;
    }
    const dataBlock = momoStorage[addressCheck]["block"] + 1;
    await getMomosBided(dataBlock, nowBlock, hexAddress);
    await getMomosListed(dataBlock, nowBlock, hexAddress);
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
    console.log(`Have ${momoUnlist.length} momos unlist in ${addressCheck}`);
    console.log(momoUnlist.toString());
    momoStorage[addressCheck]["momo"] = dataBid;
    momoStorage[addressCheck]["block"] = nowBlock;
    momoStorage[addressCheck]["hash"] = hashRate;
    momoStorage[addressCheck]["amount"] = amountMomos;
    nowBlock = await getBlockByTime(web3, (Date.now() / 1000 - 10).toFixed(0), 1);
    if (boolSaveInventory) {
        fs.writeFileSync("./data/momoStorage.json", JSON.stringify(momoStorage));
    }
    await sleep(1000);
    return momoUnlist;
};

module.exports = { checkMomosUnlistPrivateNode };
