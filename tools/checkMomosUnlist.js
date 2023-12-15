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
    try {
        console.log(scandBlock);
        // console.log(
        //     `https://api.bscscan.com/api?module=logs&action=getLogs&fromBlock=${scandBlock}&toBlock=99999999&address=${process.env.ADDRESS_MP}&topic0=${process.env.TOPIC_BID}&apikey=${process.env.BSC_API_KEY}`
        // );
        let mpListed = await axios.get(
            `https://api.bscscan.com/api?module=logs&action=getLogs&fromBlock=${scandBlock}&toBlock=99999999&address=${process.env.ADDRESS_MP}&topic0=${process.env.TOPIC_BID}&apikey=${process.env.BSC_API_KEY}`
        );
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
    try {
        console.log(scandBlock);
        // console.log(
        //     `https://api.bscscan.com/api?module=logs&action=getLogs&fromBlock=${scandBlock}&toBlock=99999999&address=${process.env.ADDRESS_MP}&topic0=${process.env.TOPIC_BID}&apikey=${process.env.BSC_API_KEY}`
        // );
        let mpListed = await axios.get(
            `https://api.bscscan.com/api?module=logs&action=getLogs&fromBlock=${scandBlock}&toBlock=99999999&address=${process.env.ADDRESS_MP}&topic0=${process.env.TOPIC_CREATE}&apikey=${process.env.BSC_API_KEY}`
        );
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
    // await getMomosBided(scandBlock, addressCheck);
    // console.log(dataBid);
    await getMomosListed(scandBlock, addressCheck);
    console.log(dataBid);
    for (let i = 10000; i < 40000; i++) {
        if (dataBid[i]) {
            console.log(i, dataBid[i]);
        }
    }
};

const startBlock = 32582086;
const nowBlock = 34368428;
const addressCheckUnList = "0x00000000000000000000000088888df23f9554e4b043b00e1f4afb39fc078888";
let dataBid = {
    11005: 2,
    11010: 1,
    11011: 1,
    11022: 1,
    11025: 1,
    11026: 1,
    11027: 2,
    11029: 3,
    11030: 1,
    11031: 1,
    11036: 1,
    11039: 1,
    11041: 1,
    11042: 1,
    11043: 1,
    11047: 1,
    11048: 1,
    11049: 1,
    11051: 5,
    11052: 5,
    11053: 7,
    11054: 3,
    11055: 4,
    12001: 1,
    12002: 2,
    12003: 1,
    12008: 2,
    12010: 1,
    12011: 2,
    12016: 3,
    12018: 1,
    12019: 2,
    12020: 1,
    12024: 1,
    12025: 2,
    12028: 1,
    12033: 1,
    12034: 1,
    12037: 1,
    12038: 1,
    12039: 1,
    12041: 1,
    12045: 2,
    12047: 1,
    12049: 1,
    12050: 1,
    12051: 4,
    12052: 3,
    12053: 6,
    12054: 2,
    12055: 3,
    13007: 1,
    13008: 3,
    13010: 1,
    13011: 3,
    13012: 1,
    13014: 1,
    13016: 1,
    13019: 1,
    13020: 1,
    13026: 1,
    13029: 1,
    13030: 2,
    13031: 1,
    13032: 2,
    13034: 1,
    13036: 1,
    13037: 1,
    13039: 3,
    13043: 1,
    13045: 1,
    13046: 1,
    13048: 2,
    13050: 2,
    13051: 3,
    13052: 4,
    13053: 8,
    13054: 3,
    13055: 6,
    14004: 1,
    14007: 3,
    14008: 1,
    14020: 1,
    14021: 1,
    14022: 1,
    14024: 2,
    14025: 1,
    14027: 2,
    14028: 2,
    14030: 1,
    14031: 2,
    14032: 2,
    14033: 1,
    14034: 1,
    14035: 1,
    14036: 3,
    14037: 1,
    14043: 2,
    14044: 1,
    14045: 1,
    14047: 2,
    14048: 1,
    14049: 2,
    14050: 1,
    14051: 2,
    14052: 4,
    14053: 1,
    14054: 6,
    14055: 1,
    21002: 1,
    21003: 1,
    21004: 1,
    21005: 1,
    21006: 1,
    21007: 1,
    21009: 2,
    21010: 1,
    21016: 1,
    21017: 1,
    21020: 1,
    21023: 1,
    21024: 4,
    21030: 2,
    21031: 1,
    21035: 1,
    21040: 2,
    21041: 1,
    21042: 4,
    21045: 1,
    21049: 2,
    21050: 1,
    21051: 5,
    21052: 3,
    21053: 2,
    21054: 5,
    21055: 5,
    22001: 1,
    22002: 1,
    22005: 2,
    22006: 1,
    22007: 2,
    22008: 1,
    22009: 2,
    22012: 3,
    22013: 1,
    22016: 2,
    22018: 1,
    22019: 7,
    22020: 1,
    22022: 2,
    22025: 1,
    22026: 3,
    22027: 1,
    22029: 1,
    22030: 1,
    22031: 1,
    22032: 1,
    22033: 2,
    22035: 1,
    22038: 1,
    22040: 2,
    22041: 1,
    22042: 2,
    22043: 3,
    22046: 2,
    22048: 1,
    22049: 1,
    22051: 9,
    22052: 4,
    22053: 9,
    22054: 1,
    22055: 6,
    23001: 1,
    23002: 1,
    23003: 3,
    23004: 2,
    23005: 1,
    23006: 2,
    23007: 1,
    23008: 4,
    23009: 1,
    23011: 1,
    23012: 1,
    23015: 5,
    23016: 2,
    23017: 3,
    23018: 2,
    23019: 1,
    23020: 1,
    23021: 1,
    23024: 1,
    23025: 2,
    23028: 1,
    23029: 1,
    23032: 1,
    23033: 1,
    23035: 1,
    23036: 3,
    23041: 2,
    23042: 1,
    23043: 1,
    23047: 2,
    23049: 3,
    23050: 2,
    23051: 3,
    23052: 1,
    23053: 3,
    23054: 3,
    23055: 3,
    24001: 1,
    24003: 1,
    24004: 2,
    24006: 1,
    24007: 1,
    24009: 1,
    24013: 1,
    24014: 1,
    24016: 1,
    24018: 1,
    24020: 3,
    24022: 1,
    24023: 1,
    24026: 1,
    24027: 3,
    24028: 1,
    24031: 2,
    24032: 3,
    24033: 2,
    24034: 1,
    24036: 1,
    24037: 1,
    24038: 1,
    24039: 1,
    24040: 1,
    24041: 1,
    24043: 1,
    24046: 1,
    24048: 1,
    24050: 3,
    24051: 5,
    24052: 6,
    24053: 7,
    24054: 10,
    24055: 1,
    31001: 1,
    31003: 1,
    31022: 1,
    31023: 1,
    31025: 1,
    31033: 1,
    32004: 1,
    32020: 1,
    32023: 2,
    32029: 1,
    32034: 1,
    32035: 1,
    33007: 1,
    33012: 1,
    33013: 1,
    33014: 1,
    33020: 1,
    33021: 1,
    33029: 1,
    33033: 1,
    33039: 1,
    33040: 1,
    34007: 1,
    34008: 1,
    34009: 1,
    34016: 1,
    34017: 1,
    34029: 1,
};

main(startBlock, addressCheckUnList);
/*
24050
11031
11030x2
11027
11010
*/
