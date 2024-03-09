require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const Web3 = require("web3");
const configJson = require("../config/config");
const abi = JSON.parse(fs.readFileSync("./abi/abiMobox.json"));
const { sleep, ranSleep } = require("../utils/common/sleep");
const { exit } = require("process");
const getMinPrice = require("../utils/common/getMinPrice");
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Promise Rejection:", err);
});
const changer = configJson.changer;

const shuffleArray = require("../utils/change/shuffleArray");
const checkReject = require("../utils/change/checkEnemyToReject");
const web3 = new Web3(new Web3.providers.HttpProvider(configJson.rpcs.change));
const minCM = configJson.minPrice.minCommon;
const minUCM = configJson.minPrice.minUncommon;
const minUNQ = configJson.minPrice.minUnique;
const Private_Key = process.env.PRIVATE_KEY_CHANGE;
const File_Key = ["_1_0_1"];
let idMomo = [];
let indexMomo = [];
let priceSell = [];
let priceBuy = [];
let boolChange = [];
let flagCountMomo = 0;
async function checkListed(address) {
    axios
        .get("https://nftapi.mobox.io/auction/list/BNB/" + address + "?sort=price&page=1&limit=128")
        .then((response) => {
            const data = response.data;
            for (let i = 0; i < data.list.length; i++) {
                idMomo.push(data.list[i].prototype);
                indexMomo.push(data.list[i].index);
                priceBuy.push(0);
                priceSell.push(Number(data.list[i].startPrice) / 10 ** 9);
                boolChange.push(" ");
            }
        })
        .catch((error) => {
            console.log(error);
        });
    await sleep(4000);
}
function checkPriceBuy(address_, page) {
    axios
        .get(
            "https://nftapi.mobox.io/auction/logs_new/" + address_ + "?&page=" + page + "&limit=50"
        )
        .then((response2) => {
            const data2 = response2.data;
            for (let i = 0; i < data2.list.length; i++) {
                let sum = 0;
                let maxAmount = 0;
                data2.list[i].amounts.map(function (value) {
                    sum += Number(value);
                    if (Number(value) > maxAmount) {
                        maxAmount = value;
                    }
                });
                if (data2.list[i].bidder == address_) {
                    for (let idx2 = 0; idx2 < data2.list[i].ids.length; idx2++) {
                        for (let maxIndex = 0; maxIndex < maxAmount; maxIndex++) {
                            for (let idx3 = 0; idx3 < idMomo.length; idx3++) {
                                if (
                                    idMomo[idx3] == data2.list[i].ids[idx2] &&
                                    priceBuy[idx3] == 0
                                ) {
                                    priceBuy[idx3] = Number(
                                        Number(data2.list[i].bidPrice) / 10 ** 9 / sum
                                    ).toFixed(3);
                                    flagCountMomo += 1;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        });
}
async function checkChangePrice(indexId) {
    if (!idChangeds.includes(idMomo[indexId])) {
        try {
            let response3 = await axios.get(
                "https://nftapi.mobox.io/auction/search_v2/BNB?page=1&limit=5&category=&vType=&sort=price&pType=" +
                    idMomo[indexId]
            );
            data3 = response3.data;
            console.log(idMomo[indexId]);
        } catch (error) {
            console.log("axios err");
        }
    } else {
        data3 = [];
    }
    ///
    let accListCache = [];
    let indexListCache = [];
    for (let indexid_ = 0; indexid_ < data3.list.length; indexid_++) {
        if (
            myAccounts.includes(data3.list[indexid_].auctor) == false &&
            indexListCache.includes(Number(indexMomo[indexId])) == false
        ) {
            if (checkReject(data3.list[0].auctor)) {
                console.log("REJECT", idMomo[indexId]);
                // boolChange[indexId] = " ";
                if (
                    ((Number(data3.list[indexid_].nowPrice) / 10 ** 9) * 0.95 - priceBuy[indexId] >
                        canLost ||
                        sellOff) &&
                    Number(Date.now() / 1000).toFixed() - Number(data3.list[indexid_].uptime) >
                        timeWaitPro * (indexid_ + 1)
                ) {
                    // time wait x2 for second momo
                    priceCache = priceSell[indexId]; // add to compare price
                    priceSell[indexId] = (Number(data3.list[indexid_].nowPrice) / 10 ** 9).toFixed(
                        3
                    );
                    if (
                        priceCache > priceSell[indexId] &&
                        idChangeds.includes(idMomo[indexId]) == false
                    ) {
                        boolChange[indexId] = "TRUE";
                        console.log(
                            idMomo[indexId] +
                                " " +
                                priceCache +
                                " to " +
                                priceSell[indexId] +
                                " Over time enemy"
                        );
                    }
                }
                break;
            }
            //fix same momo
            if (
                ((Number(data3.list[indexid_].nowPrice) / 10 ** 9) * 0.95 - priceBuy[indexId] >
                    canLost ||
                    sellOff) &&
                Number(Date.now() / 1000).toFixed() - Number(data3.list[indexid_].uptime) >
                    timeWait * (indexid_ + 1)
            ) {
                // time wait x2 for second momo
                priceCache = priceSell[indexId]; // add to compare price
                priceSell[indexId] = (Number(data3.list[indexid_].nowPrice) / 10 ** 9).toFixed(3);
                if (
                    priceCache > priceSell[indexId] &&
                    idChangeds.includes(idMomo[indexId]) == false
                ) {
                    boolChange[indexId] = "TRUE";
                    console.log(idMomo[indexId] + " " + priceCache + " to " + priceSell[indexId]);
                }
            }
            // change if price lower than min
            break;
        }
        // else {
        accListCache.push(data3.list[indexid_].id);
        indexListCache.push(data3.list[indexid_].index); // to check change same momo
        // console.log(indexListCache.includes(Number(indexMomo[indexId])))
        // console.log(data3.list[indexid_].id)
        // }
        if (indexid_ >= 1) {
            break;
        }
    }
    idChangeds.push(idMomo[indexId]);
}
async function changePrice(index_, priceChange_, Private_Key_, address_) {
    encoded = "";
    tx = "";
    for (let index = 0; index < myAccounts.length; index++) {
        if (address_ == myAccounts[index]) {
            contract = new web3.eth.Contract(abi, address_);
            encoded = contract.methods
                .changePrice(index_, priceChange_, priceChange_, 2)
                .encodeABI();
            await web3.eth.getTransactionCount(changer).then((nonce) => {
                // console.log(nonceAcc, nonce)
                tx = {
                    nonce: nonce + nonceAcc[0],
                    from: changer,
                    gas: 57865,
                    gasPrice: gasPriceScan,
                    to: address_,
                    value: 0,
                    data: encoded,
                };
            });
            nonceAcc[0] += 1;
            break;
        }
    }
    try {
        await sleep(500);
        await web3.eth.accounts.signTransaction(tx, Private_Key_).then((signed) => {
            signArray.push(signed);
        });
        console.log(signArray.length + "/" + amountChange);
        await sleep(500);
        if (signArray.length >= amountChange) {
            console.log("Changing!", signArray.length);
            for (let index = 0; index < signArray.length; index++) {
                try {
                    // console.log('Changing!')
                    if (index == signArray.length - 1) {
                        await web3.eth
                            .sendSignedTransaction(signArray[index].rawTransaction)
                            .catch((err) => {
                                console.error(err);
                            });
                    } else {
                        web3.eth
                            .sendSignedTransaction(signArray[index].rawTransaction)
                            .catch((err) => {
                                console.error(err);
                            });
                    }
                    // console.log(signChange.blockNumber)
                } catch (error) {
                    nonceAcc = [0];
                    signArray = [];
                    idCache = [];
                    console.log("Error during change price!!");
                }
            }
            nonceAcc = [0];
            signArray = [];
            idCache = [];
            await sleep(delayChange);
        }
    } catch (error) {
        console.log("Encode Fail", error);
    }
}
async function main(address_, boolMin, Private_Key_) {
    idMomo = [];
    indexMomo = [];
    priceSell = [];
    priceBuy = [];
    boolChange = [];
    flagCountMomo = 0;
    await sleep(1000);
    await checkListed(address_);
    // for (let index1 = 1; index1 < 51; index1++) {
    //     await checkPriceBuy(address_, index1)
    //     if (flagCountMomo == idMomo.length) { break }
    //     await sleep(1000)
    // }
    if (boolMin) {
        await sleep(5000);
        for (let indexMomo_ = idMomo.length - 1; indexMomo_ >= 0; indexMomo_--) {
            if (signArray.length > amountChange + 1) {
                // this code to check send bundle changePrice
                nonceAcc = File_Key.map((x) => 0);
                signArray = [];
                idCache = [];
            }
            if (idCache.includes(idMomo[indexMomo_]) || idChangeds.includes(idMomo[indexMomo_])) {
                continue;
            }
            await checkChangePrice(indexMomo_);
            await sleep(2500 + 5000 * Math.random());
            if (boolChange[indexMomo_] == "TRUE") {
                // console.log('Wait!')
                idCache.push(idMomo[indexMomo_]);
                if (
                    Number(idMomo[indexMomo_]) > 10000 &&
                    Number(idMomo[indexMomo_]) < 20000 &&
                    Number(priceSell[indexMomo_]) > minCM - minChange
                ) {
                    if (
                        Number(priceSell[indexMomo_]) - minPrices[0] <
                            configJson.minDecreasePrice &&
                        Number(priceSell[indexMomo_]) - minPrices[0] > 0
                    ) {
                        priceSell[indexMomo_] = minPrices[0];
                        console.log(`Decrease price to ${minPrices[0]}`);
                    }
                    await changePrice(
                        indexMomo[indexMomo_],
                        (Number((Number(priceSell[indexMomo_]) - minChange).toFixed(3)) * 10 ** 3)
                            .toFixed()
                            .toString() + "000000000000000",
                        Private_Key_,
                        address_
                    );
                    // console.log('Done change!')
                } else if (
                    Number(idMomo[indexMomo_]) > 20000 &&
                    Number(idMomo[indexMomo_]) < 30000 &&
                    Number(priceSell[indexMomo_]) > minUCM - minChange
                ) {
                    if (
                        Number(priceSell[indexMomo_]) - minPrices[1] <
                            configJson.minDecreasePrice &&
                        Number(priceSell[indexMomo_]) - minPrices[1] > 0
                    ) {
                        priceSell[indexMomo_] = minPrices[1];
                        console.log(`Decrease price to ${minPrices[1]}`);
                    }
                    await changePrice(
                        indexMomo[indexMomo_],
                        (Number((Number(priceSell[indexMomo_]) - minChange).toFixed(3)) * 10 ** 3)
                            .toFixed()
                            .toString() + "000000000000000",
                        Private_Key_,
                        address_
                    );
                    // console.log('Done change!')
                } else if (
                    Number(idMomo[indexMomo_]) > 30000 &&
                    Number(idMomo[indexMomo_]) < 40000 &&
                    Number(priceSell[indexMomo_]) > minUNQ - minChange
                ) {
                    if (
                        Number(priceSell[indexMomo_]) - minPrices[2] <
                            configJson.minDecreasePrice &&
                        Number(priceSell[indexMomo_]) - minPrices[2] > 0
                    ) {
                        priceSell[indexMomo_] = minPrices[2];
                        console.log(`Decrease price to ${minPrices[2]}`);
                    }
                    await changePrice(
                        indexMomo[indexMomo_],
                        (Number((Number(priceSell[indexMomo_]) - minChange).toFixed(3)) * 10 ** 3)
                            .toFixed()
                            .toString() + "000000000000000",
                        Private_Key_,
                        address_
                    );
                    // console.log('Done change!')
                } else if (Number(idMomo[indexMomo_]) > 40000) {
                    console.log(indexMomo[indexMomo_], "Require set price manual!");
                } else {
                    console.log(indexMomo[indexMomo_], "Require min price, not change!");
                }
                boolChange[indexMomo_] = " ";
            }
            await sleep(10000 + 10000 * Math.random());
        }
    }
    await sleep(1000);
}
async function loopCheck(times) {
    for (let index = 0; index < times; index++) {
        console.log("Loop:", index.toString() + "/" + times.toString());
        minPrices = await getMinPrice();
        idChangeds = [];
        shuffleArray(myAccounts);
        for (let indexAccs = 0; indexAccs < myAccounts.length; indexAccs++) {
            let isContract = await web3.eth.getStorageAt(myAccounts[indexAccs]);
            if (!Number(isContract)) {
                continue;
            }
            console.log("Account:", myAccounts[indexAccs]);
            await main(myAccounts[indexAccs], true, Private_Key);
            // await sleep(150000 + 300000 * Math.random()); //5mins per check
        }
        if (times > 1) {
            console.log(`Wait ${(delayPerLoop / 1000).toFixed(0)} seconds...`);
            await sleep(delayPerLoop); // last change per loop
        }
    }
}
// 0
const minChange = 0.001;
const timeWait = configJson.timeDelays.normal * 60 * 60 * 1; //wait latest change price of momo (hour)
const timeWaitPro = configJson.timeDelays.pro * 60 * 60 * 1; //wait latest change price of momo (hour)
const delayChange = 90 * 10 ** 3; //delay to update api (sec)
const delayPerLoop = configJson.timeDelayPerLoop * 3600000;
let myAccounts = [];
const myAcc = configJson.myAcc;
for (let index = 0; index < myAcc.length; index++) {
    if (myAcc[index][2]) {
        myAccounts.push(myAcc[index][0]);
    }
}
let signArray = [];
let idCache = [];
let nonceAcc = [0];
const amountChange = configJson.amountChange; //bundles change
const gasPriceScan = Number((configJson.gasPrices.change * 10 ** 9).toFixed());
const sellOff = true; // if true - sale per minPrice, if false - sale if not loss
const canLost = -1;
let minPrices = [];
if (configJson.minDecreasePrice > 0.2) {
    console.warn("minDecreasePrice must be greater than 0.2");
    exit();
}
loopCheck(5000);
