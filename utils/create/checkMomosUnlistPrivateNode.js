require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
const Web3 = require("web3");
const { exit } = require("process");
const configJson = require("../../config/config");
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
const { abiCheckListed, abiCheckBided } = require("../../abi/abiCheckUnlist");
const { getZeroBlockCsv } = require("./getZeroBlockCsv");
const getBlockByTime = require("../bid/getBlockByTime");
const { sleep, ranSleep } = require("../common/sleep");
let momoStorage = {};
let dataBid = {};

const getMomosBided = async (endBlock, nowBlock, addressCheck) => {
    const cacheBlock = endBlock;
    console.log(cacheBlock);
    // console.log(mpListed, 1);
    try {
        let mpListed = null;
        try {
            let toBlockNew = endBlock + 50000;
            // if (endBlock + 50000 > nowBlock) {
            //     endBlock = nowBlock;
            // }
            mpListed = await web3.eth.getPastLogs({
                address: process.env.ADDRESS_MP,
                fromBlock: endBlock,
                toBlock: toBlockNew,
                topics: [process.env.TOPIC_BID], // the second parameter is variable c
            });
            // console.log(mpListed)
            // exit()
        } catch (err) {
            console.log(err);
            await getMomosBided(cacheBlock, nowBlock, addressCheck);
        }
        const data = mpListed;
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
        if (Number(data[data.length - 1].blockNumber) < nowBlock) {
            await getMomosBided(
                Number(data[data.length - 1].blockNumber) + 1,
                nowBlock,
                addressCheck
            );
        }
    } catch (error) {}
};
const getMomosListed = async (endBlock, nowBlock, addressCheck) => {
    const cacheBlock = endBlock;
    try {
        console.log(endBlock);
        let mpListed = "";
        try {
            // mpListed = await axios.get(
            //     `https://api.bscscan.com/api?module=logs&action=getLogs&fromBlock=${endBlock}&toBlock=99999999&address=${process.env.ADDRESS_MP}&topic0=${process.env.TOPIC_CREATE}&apikey=${process.env.BSC_API_KEY}`
            // );
            let toBlockNew = endBlock + 50000;
            // if (endBlock + 50000 > nowBlock) {
            //     endBlock = nowBlock;
            // }
            mpListed = await web3.eth.getPastLogs({
                address: process.env.ADDRESS_MP,
                fromBlock: endBlock,
                toBlock: toBlockNew,
                topics: [process.env.TOPIC_CREATE], // the second parameter is variable c
            });
        } catch (error) {
            await getMomosListed(cacheBlock, nowBlock, addressCheck);
        }
        const data = mpListed;
        for (let ii = 0; ii < data.length; ii++) {
            if (data[ii].topics[1] === addressCheck) {
                const decodedData = await web3.eth.abi.decodeParameters(
                    abiCheckListed,
                    data[ii].data
                );
                for (let j = 0; j < decodedData.ids.length; j++) {
                    if (dataBid[decodedData.ids[j]] === undefined) {
                        console.log("Err scan bided");
                        exit();
                    } else {
                        dataBid[decodedData.ids[j]] -= Number(decodedData.amounts[j]);
                    }
                }
            }
        }
        if (Number(data[data.length - 1].blockNumber) < nowBlock) {
            await getMomosListed(
                Number(data[data.length - 1].blockNumber) + 1,
                nowBlock,
                addressCheck
            );
        }
    } catch (error) {}
};

const checkMomosUnlistPrivateNode = async (addressCheck, boolSaveInventory) => {
    momoStorage = require("../../data/momoStorage.json");
    console.log(momoStorage[addressCheck]["block"]);
    dataBid = momoStorage[addressCheck]["momo"];
    const hexAddress = `0x000000000000000000000000${addressCheck.toLowerCase().slice(2)}`;
    let nowBlock = await getBlockByTime(web3, (Date.now() / 1000 - 10).toFixed(0));
    console.log(nowBlock);
    if (nowBlock - momoStorage[addressCheck]["block"] > 144000) {
        console.log(`${addressCheck} wait for update after 5 days`);
        return;
    }
    // const dataBlock = await getZeroBlockApi(nowBlock, hexAddress);
    // const dataBlock = getZeroBlockCsv(addressCheck);
    const dataBlock = momoStorage[addressCheck]["block"] + 1;
    console.log(`First block is: ${dataBlock}`);
    await getMomosBided(dataBlock, nowBlock, hexAddress);
    await getMomosListed(dataBlock, nowBlock, hexAddress);
    let momoUnlist = [];
    for (let i = 10000; i < 40000; i++) {
        if (dataBid[i]) {
            for (let j = 0; j < dataBid[i]; j++) {
                momoUnlist.push(`${i}`);
            }
        }
        if (Number(dataBid[i]) == 0) {
            delete dataBid[i];
        }
    }
    console.log(momoUnlist.length);
    console.log(momoUnlist.toString());
    console.log(addressCheck);
    momoStorage[addressCheck]["momo"] = dataBid;
    momoStorage[addressCheck]["block"] = nowBlock;
    // momoStorage[addressCheck]["amount"] = momoUnlist.length;
    nowBlock = await getBlockByTime(web3, (Date.now() / 1000 - 10).toFixed(0));
    if (boolSaveInventory) {
        fs.writeFileSync("./data/momoStorage.json", JSON.stringify(momoStorage));
    }
    // fs.writeFileSync("./data/momoStorage.json", JSON.stringify(momoStorage));
    await sleep(1000);
    return momoUnlist;
};

module.exports = { checkMomosUnlistPrivateNode };
// checkMomosUnlistPrivateNode("0x891016f99BA622F8556bE12B4EA336157aA6cb20");
