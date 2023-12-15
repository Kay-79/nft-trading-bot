require("dotenv").config();
const axios = require("axios");
const Web3 = require("web3");
const { exit } = require("process");
const web3 = new Web3();
const abiCheckListed = [
    { internalType: "uint256", name: "startPrice", type: "uint256" },
    { internalType: "uint256", name: "endPrice", type: "uint256" },
    { internalType: "uint256", name: "durationDays", type: "uint256" },
    { internalType: "uint256", name: "index", type: "uint256" },
    { internalType: "uint256", name: "tokenId", type: "uint256" },
    { internalType: "uint256[]", name: "ids", type: "uint256[]" },
    { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
    { internalType: "uint256", name: "startTime", type: "uint256" },
];
const abiCheckBided = [
    { internalType: "uint256", name: "bidPrice", type: "uint256" },
    { internalType: "uint256", name: "index", type: "uint256" },
    { internalType: "uint256", name: "tokenId", type: "uint256" },
    { internalType: "uint256[]", name: "ids", type: "uint256[]" },
    { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
    { internalType: "uint256", name: "startTime", type: "uint256" },
];

const getMomosBided = async (scandBlock, addressCheck) => {
    const cacheBlock = scandBlock;
    try {
        console.log(scandBlock);
        // console.log(
        //     `https://api.bscscan.com/api?module=logs&action=getLogs&fromBlock=${scandBlock}&toBlock=99999999&address=${process.env.ADDRESS_MP}&topic0=${process.env.TOPIC_BID}&apikey=${process.env.BSC_API_KEY}`
        // );
        let mpListed = "";
        try {
            mpListed = await axios.get(
                `https://api.bscscan.com/api?module=logs&action=getLogs&fromBlock=${scandBlock}&toBlock=99999999&address=${process.env.ADDRESS_MP}&topic0=${process.env.TOPIC_BID}&apikey=${process.env.BSC_API_KEY}`
            );
        } catch (err) {
            await getMomosBided(cacheBlock, addressCheck);
        }
        const data = mpListed.data.result;
        for (let i = 0; i < data.length; i++) {
            // console.log(data[0]);
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
            await getMomosBided(Number(data[data.length - 1].blockNumber) + 1, addressCheck);
        }
    } catch (error) {}
};
const getMomosListed = async (scandBlock, addressCheck) => {
    const cacheBlock = scandBlock;
    try {
        console.log(scandBlock);
        // console.log(
        //     `https://api.bscscan.com/api?module=logs&action=getLogs&fromBlock=${scandBlock}&toBlock=99999999&address=${process.env.ADDRESS_MP}&topic0=${process.env.TOPIC_BID}&apikey=${process.env.BSC_API_KEY}`
        // );
        let mpListed = "";
        try {
            mpListed = await axios.get(
                `https://api.bscscan.com/api?module=logs&action=getLogs&fromBlock=${scandBlock}&toBlock=99999999&address=${process.env.ADDRESS_MP}&topic0=${process.env.TOPIC_CREATE}&apikey=${process.env.BSC_API_KEY}`
            );
        } catch (error) {
            await getMomosListed(cacheBlock, addressCheck);
        }
        const data = mpListed.data.result;
        for (let ii = 0; ii < data.length; ii++) {
            if (data[ii].topics[1] === addressCheck) {
                const decodedData = await web3.eth.abi.decodeParameters(
                    abiCheckListed,
                    data[ii].data
                );
                // console.log(decodedData);
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
            await getMomosListed(Number(data[data.length - 1].blockNumber) + 1, addressCheck);
        }
    } catch (error) {}
};

const main = async (scandBlock, addressCheck) => {
    await getMomosBided(scandBlock, addressCheck);
    console.log(dataBid);
    await getMomosListed(scandBlock, addressCheck);
    console.log(dataBid);
    for (let i = 10000; i < 40000; i++) {
        if (dataBid[i]) {
            console.log(i, dataBid[i]);
        }
    }
    console.log(addressCheckUnList);
};

const startBlock = 32273370;
const nowBlock = 34375084;
const addressCheckUnList = "0x0000000000000000000000001dfc0656abcfe473f968066157b0d0d740aff4e6";
let dataBid = {};
// console.log(
//     `https://api.bscscan.com/api?module=logs&action=getLogs&fromBlock=${34124837}&toBlock=99999999&address=${
//         process.env.ADDRESS_MP
//     }&topic0=${process.env.TOPIC_CREATE}&apikey=${process.env.BSC_API_KEY}`
// );
// exit();
main(startBlock, addressCheckUnList);
