require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
const Web3 = require("web3");
const { exit } = require("process");
const configJson = require("../../config/config");
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
const { abiCheckListed, abiCheckBided } = require("../../abi/abiCheckUnlist");
const { getZeroBlockCsv } = require("./getZeroBlockCsv");
const  getBlockByTime  = require("../bid/getBlockByTime");
let inventory = {};
let dataBid = {};

const getMomosBided = async (endBlock, nowBlock, addressCheck) => {
    const cacheBlock = endBlock;
    console.log(cacheBlock);
    // console.log(mpListed, 1);
    try {
        let mpListed = null;
        try {
            mpListed = await web3.eth.getPastLogs({
                address: process.env.ADDRESS_MP,
                fromBlock: endBlock,
                toBlock: endBlock + 50000,
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
            mpListed = await axios.get(
                `https://api.bscscan.com/api?module=logs&action=getLogs&fromBlock=${endBlock}&toBlock=99999999&address=${process.env.ADDRESS_MP}&topic0=${process.env.TOPIC_CREATE}&apikey=${process.env.BSC_API_KEY}`
            );
            mpListed = await web3.eth.getPastLogs({
                address: process.env.ADDRESS_MP,
                fromBlock: endBlock,
                toBlock: endBlock + 50000,
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

const checkMomosUnlistPrivateNode = async (addressCheck) => {
    inventory = require("../../data/inventory.json");
    console.log(inventory[addressCheck]["block"]);
    dataBid = inventory[addressCheck]["momo"];
    const hexAddress = `0x000000000000000000000000${addressCheck.toLowerCase().slice(2)}`;
    let nowBlock = await getBlockByTime(web3, Date.now() / 1000);
    console.log(nowBlock);
    // const dataBlock = await getZeroBlockApi(nowBlock, hexAddress);
    // const dataBlock = getZeroBlockCsv(addressCheck);
    const dataBlock = inventory[addressCheck]["block"] + 1;
    console.log(`First block is: ${dataBlock}`);
    await getMomosBided(dataBlock, nowBlock, hexAddress);
    await getMomosListed(dataBlock, nowBlock, hexAddress);
    inventory[addressCheck]["momo"] = dataBid;
    inventory[addressCheck]["block"] = nowBlock;
    let momoUnlist = [];
    for (let i = 10000; i < 40000; i++) {
        if (dataBid[i]) {
            for (let j = 0; j < dataBid[i]; j++) {
                momoUnlist.push(`${i}`);
            }
        }
    }
    fs.writeFileSync("./data/inventory.json", JSON.stringify(inventory));
    console.log(momoUnlist.length);
    console.log(momoUnlist.toString());
    console.log(addressCheck);
    return momoUnlist;
};

module.exports = { checkMomosUnlistPrivateNode };
checkMomosUnlistPrivateNode("0x891016f99BA622F8556bE12B4EA336157aA6cb20");
