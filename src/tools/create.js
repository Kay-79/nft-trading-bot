require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const { exit } = require("process");
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed4.binance.org"));
const configJson = require("../config/config");
const { sleep, ranSleep } = require("../utils/common/sleep");
const { abiAmount } = require("../abi/abiCheckLogs");
const getMinPrice = require("../utils/common/getMinPrice");
const { updateInventory } = require("../utils/create/checkMomosUnlistPrivateNodeV2");
const prepareBatch = require("../utils/create/prepareBatch");

minCM = configJson.minPrice.minCommon;
minUCM = configJson.minPrice.minUncommon;
minUNQ = configJson.minPrice.minUnique;
minR = configJson.minPrice.minRare;
idMomo = [];
indexMomo = [];
priceSell = [];
priceBuy = [];
indexList = [];
nameMomo = [];
boolChange = [];
flagID = false;
flagCountMomo = 0;
amountBid = 0;
async function checkChangePrice(indexId) {
    await sleep(2500 + 5000 * Math.random());
    let response3 = await axios
        .get(
            "https://nftapi.mobox.io/auction/search_v2/BNB?page=1&limit=10&category=&vType=&sort=price&pType=" +
                idMomoBought[indexId]
        )
        .catch(e => {
            console.log("Err2");
        });
    const data3 = response3.data.list;
    if (!data3.length || !data3) {
        priceSell[indexId] = 15;
        return false;
    }
    console.log(
        idMomoBought[indexId].toString() +
            "-" +
            (indexId + 1).toString() +
            "/" +
            amountBatchToCreate.toString()
    );
    if (myAccounts.includes(data3[0].auctor)) {
        priceSell[indexId] = (Number(data3[0].nowPrice) / 10 ** 9).toFixed(3);
        for (let index_z = 0; index_z < data3.length; index_z++) {
            if (!myAccounts.includes(data3[index_z].auctor)) {
                priceSell[indexId] = (
                    Number(data3[index_z].nowPrice) / 10 ** 9 -
                    minChange
                ).toFixed(3);
                break;
            }
        }
    } else {
        priceSell[indexId] = (Number(data3[0].nowPrice) / 10 ** 9 - minChange).toFixed(3);
        for (let index_q = 0; index_q < data3.length; index_q++) {
            if (Number(Date.now() / 1000).toFixed() - Number(data3[index_q].uptime) > timeWait) {
                if (myAccounts.includes(data3[index_q].auctor)) {
                    priceSell[indexId] = (Number(data3[index_q].nowPrice) / 10 ** 9).toFixed(3);
                } else {
                    priceSell[indexId] = (
                        Number(data3[index_q].nowPrice) / 10 ** 9 -
                        minChange
                    ).toFixed(3);
                    break;
                }
            }
        }
        let sttRarity = idMomoBought[indexId].toString().slice(0, 1);
        switch (sttRarity.toString()) {
            case "1":
                if (Number(priceSell[indexId]) < minPrices[0]) {
                    priceSell[indexId] = (minPrices[0] - minChange).toFixed(3);
                }
                if (Number(priceSell[indexId]) - minPrices[0] < configJson.minDecreasePrice) {
                    priceSell[indexId] = (minPrices[0] - minChange).toFixed(3);
                }
                break;
            case "2":
                if (Number(priceSell[indexId]) < minPrices[1]) {
                    priceSell[indexId] = (minPrices[1] - minChange).toFixed(3);
                }
                if (Number(priceSell[indexId]) - minPrices[1] < configJson.minDecreasePrice) {
                    priceSell[indexId] = (minPrices[1] - minChange).toFixed(3);
                }
                break;
            case "3":
                if (Number(priceSell[indexId]) < minPrices[2]) {
                    priceSell[indexId] = (minPrices[2] - minChange).toFixed(3);
                }
                if (Number(priceSell[indexId]) - minPrices[2] < configJson.minDecreasePrice) {
                    priceSell[indexId] = (minPrices[2] - minChange).toFixed(3);
                }
                break;
            default:
                priceSell[indexId] = (minR - minChange).toFixed(3);
                break;
        }
        if (!data3.length) {
            priceSell[indexId] = 15;
        }
    }
    console.log("Price to sell: " + priceSell[indexId]);
}

async function getPriceToSell(address, boolMin) {
    idMomoBought = [];
    // idMomoBought = await checkMomosUnlistPrivateNode(address, false);
    let idMomoBoughtRaw = inventory.contracts.find(e => e.contractAddress === address).momo;
    for (let i = 9999; i < 40000; i++) {
        if (idMomoBoughtRaw[i]) {
            for (let j = 0; j < idMomoBoughtRaw[i]; j++) {
                idMomoBought.push(`${i}`);
            }
        }
    }
    const BatchPrepare = prepareBatch(idMomoBought, priceSell, amountBatchToCreate * 6);
    idMomoBought = BatchPrepare[0];
    priceSell = BatchPrepare[1];
    console.log(idMomoBought);
    console.log(priceSell);
    // exit();
    //
    //
    //
    //
    //
    value = idMomoBought.length;
    console.log(idMomoBought.toString());
    if (idMomoBought.length != value) {
        console.log("Balance momo is wrong");
        return;
    }
    if (boolMin) {
        await sleep(1000);
        for (let indexMomo = 0; indexMomo < idMomoBought.length; indexMomo++) {
            if (idMomoBought[indexMomo] == idMomoBought[indexMomo - 1]) {
                priceSell[indexMomo] = priceSell[indexMomo - 1];
            } else {
                await checkChangePrice(indexMomo);
                await sleep(1000);
            }
            if (indexMomo + 1 >= amountBatchToCreate && amountBatchToCreate != 0) {
                break;
            }
        }
        if (!amountBatchToCreate) {
            console.log(idMomoBought);
            console.log(priceSell);
            console.log("Don't have momo to create");
            exit();
        }
    }
    amoutList = 0;
    cacheListID = [];
    cacheListPrice = [];
    priceList = [];
    idList = [];
    for (let wr = 0; wr < idMomoBought.length; wr++) {
        amoutList += 1;
        cacheListID.push(idMomoBought[wr]);
        cacheListPrice.push(priceSell[wr]);
        if (amoutList == 6) {
            idList.push(cacheListID);
            priceList.push(cacheListPrice);
            cacheListID = [];
            cacheListPrice = [];
            amoutList = 0;
        }
    }
    console.log(
        "ids =\n" + JSON.stringify(idList) + "\nprices =\n" + JSON.stringify(priceList) + "\n"
    );
    console.log(indexs.length, idList.length, priceList.length);
    for (let ii = 0; ii < priceList.length; ii++) {
        for (let jj = 0; jj < priceList[ii].length; jj++) {
            priceList[ii][jj] =
                Math.round(Number(priceList[ii][jj]) * 10 ** 5).toString() + "0000000000000";
            if (Number(priceList[ii][jj]) < 0.5 * 10 ** 18) {
                console.log("Err Price");
                exit();
            }
        }
    }
}

async function checkIndex(address) {
    idMomo = [];
    indexMomo = [];
    priceSell = [];
    priceBuy = [];
    nameMomo = [];
    timeChange = [];
    flagID = false;
    flagCountMomo = 0;
    let response = await axios
        .get("https://nftapi.mobox.io/auction/list/BNB/" + address + "?sort=-time&page=1&limit=128")
        .catch(e => {
            console.log("Err1");
        });
    const data = response.data;
    for (let i = 0; i < data.list.length; i++) {
        indexMomo.push(data.list[i].index);
    }
    let amount = 0;
    let indexMomo2 = indexMomo.sort((a, b) => a - b);
    for (let i = 0; i < 128; i++) {
        if (i != indexMomo2[i]) {
            if (amount == 0) {
                indexEmpty = i;
            }
            amount += 1;
            indexMomo2.splice(i, 0, i);
            if (amount == 6) {
                amount = 0;
                indexs.push(indexEmpty);
            }
        }
    }
    if (indexs) {
        console.log(indexs);
    } else {
        console.log("Auctions are full !!");
        exit();
    }
    indexs = indexs.slice(0, (value / 6 - 0.5).toFixed()); //, indexs.length)
}

async function sendTxt(gasPrice_, gasLimit_, index_, ids_, prices_, hexData_, nameFile_) {
    const Private_Key = process.env.PRIVATE_KEY_CHANGE_MAINNET;
    const web3 = new Web3(new Web3.providers.HttpProvider(configJson.rpcs.create));
    acc = web3.eth.accounts.privateKeyToAccount(Private_Key);
    const abi = [
        {
            inputs: [
                { name: "suggestIndex_", type: "uint256" },
                { name: "tokenIds_", type: "uint256[]" },
                { name: "prices721_", type: "uint256[]" },
                { name: "ids_", type: "uint256[]" },
                { name: "prices1155_", type: "uint256[]" }
            ],
            name: "createAuctionBatch",
            outputs: [],
            stateMutability: "payable",
            type: "function"
        }
    ];
    const consractAddress = configJson.addressMP;
    const contract = new web3.eth.Contract(abi, consractAddress);
    emptyVar = [];
    tx = "";
    encoded = "";
    signArray = "";
    if (hexData_.length == 0) {
        encoded = contract.methods
            .createAuctionBatch(index_, emptyVar, emptyVar, ids_, prices_)
            .encodeABI();
    } else {
        encoded = hexData_;
    }
    tx = {
        from: acc.address,
        gas: gasLimit_,
        gasPrice: (gasPrice_ * 10 ** 9).toFixed(), // + i * 10 ** 6,
        to: accSell,
        value: 0,
        data: encoded
    };
    await web3.eth.accounts.signTransaction(tx, Private_Key).then(signed => {
        signArray = signed;
    });
    console.log("Listing");
    try {
        let createAuctionBatch = await web3.eth.sendSignedTransaction(signArray.rawTransaction);
        console.log("Done at block:", createAuctionBatch.blockNumber);
        boolSell = "TRUE";
    } catch (error) {
        console.log("Over time or fail during list!");
        exit();
    }
}

async function createBatch(gasPrice_, gasLimit_, hexData_, nameFile_) {
    accSell = "";
    for (let index = 0; index < myAcc.length; index++) {
        if (nameFile_ == myAcc[index][1]) {
            accSell = myAcc[index][0];
        }
    }
    if (accSell == "") {
        console.log("Empty accSell");
        exit();
    }
    let amountUnList = inventory.contracts.find(e => e.contractAddress === accSell).amount;
    if (amountUnList < 6) return;
    value = amountUnList;
    if (amountUnList != value) {
        console.log("amountUnList != value");
        console.log("amountUnList", amountUnList);
        console.log("value", value);
        exit();
    }
    await checkIndex(accSell);
    amountUnList / 6 > indexs.length
        ? (amountBatchToCreate = indexs.length * 6)
        : (amountBatchToCreate = amountUnList);
    console.log(`${amountBatchToCreate} momos to create`);
    if (amountBatchToCreate < 6) return;
    await getPriceToSell(accSell, true); //_1_0_1
    let count = 0;
    while (true) {
        if (hexData_.length > 0) {
            await sendTxt(gasPrice_, gasLimit_, "", "", "", hexData_, nameFile_);
            break;
        }
        for (let index = 0; index < indexs.length; index++) {
            if (indexs[index] != undefined) {
                boolSell = "FALSE";
                console.log(`${indexs[index]}, [], [], [${idList[index]}], [${priceList[index]}]`);
                try {
                    await sendTxt(
                        gasPrice_,
                        gasLimit_,
                        indexs[index],
                        idList[index],
                        priceList[index],
                        "",
                        nameFile_
                    );
                } catch (error) {
                    ("Create on private node!");
                }
                if (boolSell == "TRUE") {
                    indexs[index] = undefined;
                    count += 1;
                }
            }
            await sleep(5000);
        }
        if (count >= indexs.length) {
            console.log("Done");
            break;
        }
        await sleep(5000);
    }
}

timeWait = 5 * 60 * 60 * 1; //wait latest change price
idMomoBought = [];
priceSell = [];
myAccounts = [];
amountBatchToCreate = 0;
const myAcc = configJson.myAcc;
for (let index = 0; index < myAcc.length; index++) {
    myAccounts.push(myAcc[index][0]);
}
valueBid = 999;
indexs = [];
priceList = [];
ids = [];
const minChange = 0.001;
let accSell = "";
value = 0; // without rare and epic
let minPrices = [];
let inventory;
const create = async () => {
    await updateInventory(true);
    inventory = require("../data/inventory.json");
    minPrices = await getMinPrice();
    console.log(minPrices);
    for (let i = 0; i < myAcc.length; i++) {
        console.log(myAcc[i][1]);
        if (myAcc[i][1] == "_1_0_1" || myAcc[i][1] === "_5_8_1" || myAcc[i][1] === "_0_E_9") {
            continue;
        }
        await createBatch(configJson.gasPrices.create, 1000000, "", myAcc[i][1]);
        indexs = [];
        priceList = [];
        ids = [];
    }
    console.log("Done listing momos");
    // sleep(10000);
    // console.log("Updating zero block");
    // await updateZeroBlock();
    // await updateInventory(myAccounts);
};
create();
// module.exports = { create };
