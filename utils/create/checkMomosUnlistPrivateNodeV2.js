require("dotenv").config();
const fs = require("fs");
const Web3 = require("web3");
const { exit } = require("process");
const configJson = require("../../config/config");
const web3 = new Web3(new Web3.providers.HttpProvider(configJson.rpcs.create));
const {
    abiCheckListed,
    abiCheckBided,
    abiCheckCanceled,
    abiCheckZeroHash,
    abiAmount
} = require("../../abi/abiCheckUnlist");
const getBlockByTime = require("../bid/getBlockByTime");
const { sleep } = require("../common/sleep");
let momoStorage = require("../../data/inventory.json");
const HEX_ADDRESSES = momoStorage.contracts.map(item => item.hexAddress);
const TOPICS = [
    process.env.TOPIC_BID,
    process.env.TOPIC_CREATE,
    process.env.TOPIC_CANCEL,
    process.env.TOPIC_HASH
];

const syncInventory = async (endBlock, nowBlock) => {
    if (endBlock > nowBlock) {
        return;
    }
    momoStorage.syncedBlock = endBlock;
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
                toBlock: toBlockNew
            });
        } catch (err) {
            console.warn(err.message);
            await saveInventory();
            await sleep(5000);
            await syncInventory(cacheBlock, nowBlock);
        }
        for (let i = 0; i < data.length; i++) {
            let decodedData;
            if (TOPICS.includes(data[i].topics[0])) {
                switch (data[i].topics[0]) {
                    case process.env.TOPIC_BID:
                        if (HEX_ADDRESSES.includes(data[i].topics[2])) {
                            // im a bidder
                            console.log(`TOPIC_BID: ${data[i].transactionHash}`);
                            const indexContract = HEX_ADDRESSES.indexOf(data[i].topics[2]);
                            decodedData = await web3.eth.abi.decodeParameters(
                                abiCheckBided,
                                data[i].data
                            );
                            for (let k = 0; k < decodedData.ids.length; k++) {
                                if (
                                    momoStorage.contracts[indexContract].momo[
                                        decodedData.ids[k]
                                    ] === undefined
                                ) {
                                    momoStorage.contracts[indexContract].momo[
                                        decodedData.ids[k]
                                    ] = 0;
                                }
                                momoStorage.contracts[indexContract].momo[decodedData.ids[k]] +=
                                    Number(decodedData.amounts[k]);
                            }
                            momoStorage.syncedBlock = data[i].blockNumber;
                        } else if (HEX_ADDRESSES.includes(data[i].topics[1])) {
                            // im a author
                            const indexContract = HEX_ADDRESSES.indexOf(data[i].topics[1]);
                            decodedData = await web3.eth.abi.decodeParameters(
                                abiCheckBided,
                                data[i].data
                            );
                            for (let k = 0; k < decodedData.ids.length; k++) {
                                if (
                                    momoStorage.contracts[indexContract].list[
                                        decodedData.ids[k]
                                    ] === undefined
                                ) {
                                    momoStorage.contracts[indexContract].list[
                                        decodedData.ids[k]
                                    ] = 0;
                                }
                                momoStorage.contracts[indexContract].list[decodedData.ids[k]] -=
                                    Number(decodedData.amounts[k]);
                            }
                            momoStorage.syncedBlock = data[i].blockNumber;
                        }
                        break;
                    case process.env.TOPIC_CREATE:
                        if (HEX_ADDRESSES.includes(data[i].topics[1])) {
                            console.log(`TOPIC_CREATE: ${data[i].transactionHash}`);
                            const indexContract = HEX_ADDRESSES.indexOf(data[i].topics[1]);
                            decodedData = await web3.eth.abi.decodeParameters(
                                abiCheckListed,
                                data[i].data
                            );
                            for (let k = 0; k < decodedData.ids.length; k++) {
                                if (
                                    momoStorage.contracts[indexContract].list[
                                        decodedData.ids[k]
                                    ] === undefined
                                ) {
                                    momoStorage.contracts[indexContract].list[
                                        decodedData.ids[k]
                                    ] = 0;
                                }
                                momoStorage.contracts[indexContract].list[decodedData.ids[k]] +=
                                    Number(decodedData.amounts[k]);
                                momoStorage.contracts[indexContract].momo[decodedData.ids[k]] -=
                                    Number(decodedData.amounts[k]);
                            }
                            momoStorage.syncedBlock = data[i].blockNumber;
                        }
                        break;
                    case process.env.TOPIC_HASH:
                        if (HEX_ADDRESSES.includes(data[i].topics[1])) {
                            console.log(`TOPIC_HASH: ${data[i].transactionHash}`);
                            const indexContract = HEX_ADDRESSES.indexOf(data[i].topics[1]);
                            decodedData = await web3.eth.abi.decodeParameters(
                                abiCheckZeroHash,
                                data[i].data
                            );
                            if (Number(decodedData.lastHash) === 0) {
                                momoStorage.contracts[indexContract].latestZeroHashBlock =
                                    data[i].blockNumber;
                            }
                            momoStorage.contracts[indexContract].hash = Number(
                                decodedData.lastHash
                            );
                            momoStorage.syncedBlock = data[i].blockNumber;
                        }
                        break;
                    case process.env.TOPIC_CANCEL:
                        if (HEX_ADDRESSES.includes(data[i].topics[1])) {
                            console.log(`TOPIC_CANCEL: ${data[i].transactionHash}`);
                            const indexContract = HEX_ADDRESSES.indexOf(data[i].topics[1]);
                            decodedData = await web3.eth.abi.decodeParameters(
                                abiCheckCanceled,
                                data[i].data
                            );
                            for (let k = 0; k < decodedData.ids.length; k++) {
                                momoStorage.contracts[indexContract].momo[decodedData.ids[k]] +=
                                    Number(decodedData.amounts[k]);
                                momoStorage.contracts[indexContract].list[decodedData.ids[k]] -=
                                    Number(decodedData.amounts[k]);
                            }
                            momoStorage.syncedBlock = data[i].blockNumber;
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        if (!data.length) {
            console.log(`data length: ${data.length} ==> continue scan bid`);
            await syncInventory(cacheBlock + configJson.limitBlockUpdate, nowBlock);
        }
        if (cacheBlock + configJson.limitBlockUpdate < nowBlock) {
            if (Number(data[data.length - 1].blockNumber) < nowBlock) {
                await syncInventory(Number(data[data.length - 1].blockNumber) + 1, nowBlock);
            }
        }
    } catch (error) {
        console.warn(error);
    }
};
const updateInventory = async boolSaveInventory => {
    console.log(`Last block synced: ${momoStorage.syncedBlock}`);
    const nowBlock = await getBlockByTime(web3, (Date.now() / 1000 - 10).toFixed(0), 1);
    console.log(`Now block is: ${nowBlock}`);
    const dataBlock = momoStorage["syncedBlock"] + 1;
    await syncInventory(dataBlock, nowBlock);
    momoStorage["syncedBlock"] = nowBlock;
    if (boolSaveInventory) {
        await saveInventory();
    }
    await sleep(1000);
};
const saveInventory = async () => {
    for (let i = 0; i < momoStorage.contracts.length; i++) {
        momoStorage.contracts[i].amount = 0;
        momoStorage.contracts[i].amountList = 0;
        for (let j = 10000; j < 40000; j++) {
            if (!momoStorage.contracts[i].momo[j]) {
                delete momoStorage.contracts[i].momo[j];
            } else {
                momoStorage.contracts[i].amount += momoStorage.contracts[i].momo[j];
            }
            if (!momoStorage.contracts[i].list[j]) {
                delete momoStorage.contracts[i].list[j];
            } else {
                momoStorage.contracts[i].amountList += momoStorage.contracts[i].list[j];
            }
        }
    }
    fs.writeFileSync("./data/inventory.json", JSON.stringify(momoStorage));
    await sleep(1000);
};
updateInventory(true);
// module.exports = { updateInventory };
