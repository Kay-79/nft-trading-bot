require("dotenv").config();
const axios = require("axios");
const Web3 = require("web3");
const { exit } = require("process");
const web3 = new Web3();
const { abiCheckListed, abiCheckBided } = require("../../abi/abiCheckUnlist");
let dataBid = {};

const getBlockWithZeroHash = async (blockCheck, addressCheck) => {
    console.log(blockCheck);
    try {
        let firstBlock = blockCheck - 2000;
        let mpListed = null;
        try {
            mpListed = await axios.get(
                `https://api.bscscan.com/api?module=logs&action=getLogs&fromBlock=${firstBlock}&toBlock=${blockCheck}&address=${process.env.ADDRESS_MOMO}&topic0=${process.env.TOPIC_HASH}&apikey=${process.env.BSC_API_KEY}`
            );
        } catch (error) {
            console.log(error);
            return await getBlockWithZeroHash(blockCheck, addressCheck);
        }
        const data = mpListed.data.result;
        if (data.length === 0) {
            return await getBlockWithZeroHash(firstBlock, addressCheck);
        }
        for (let i = data.length - 1; i >= 0; i--) {
            if (data[i].topics[1] === addressCheck) {
                if (data[i].data.slice(120, 130) === "0000000000") {
                    const result = Number(data[i].blockNumber);
                    return result;
                }
            }
        }
        return await getBlockWithZeroHash(Number(data[0].blockNumber) - 1, addressCheck);
    } catch (error) {
        console.log(error);
        exit();
    }
};
const getMomosBided = async (endBlock, nowBlock, addressCheck) => {
    const cacheBlock = endBlock;
    console.log(cacheBlock);
    try {
        let mpListed = null;
        try {
            mpListed = await axios.get(
                `https://api.bscscan.com/api?module=logs&action=getLogs&fromBlock=${endBlock}&toBlock=99999999&address=${process.env.ADDRESS_MP}&topic0=${process.env.TOPIC_BID}&apikey=${process.env.BSC_API_KEY}`
            );
        } catch (err) {
            await getMomosBided(cacheBlock, nowBlock, addressCheck);
        }
        const data = mpListed.data.result;
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
        } catch (error) {
            await getMomosListed(cacheBlock, nowBlock, addressCheck);
        }
        const data = mpListed.data.result;
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

const checkMomosUnlist = async (addressCheck) => {
    dataBid = {}; // reset data
    const hexAddress = `0x000000000000000000000000${addressCheck.toLowerCase().slice(2)}`;
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
    const dataBlock = await getBlockWithZeroHash(nowBlock, hexAddress);
    // const dataBlock = 34676459;
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
    }
    console.log(momoUnlist.length);
    console.log(momoUnlist.toString());
    console.log(addressCheck);
    return momoUnlist;
};

module.exports = { checkMomosUnlist };
