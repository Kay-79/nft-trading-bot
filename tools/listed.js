var axios = require("axios");
const fs = require("fs");
const Web3 = require("web3");
const configJson = JSON.parse(fs.readFileSync("./config/config.json"));
// const web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.ankr.com/bsc"));
const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.bnbchain.org"));
const abiBUSD = [
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
];
const contract = new web3.eth.Contract(abiBUSD, "0x55d398326f99059ff775485246999027b3197955");
const dataMomo = fs.readFileSync("./data/dataMomo.txt", "utf8");
const momoID = dataMomo.split("\n");

idMomo = [];
indexMomo = [];
priceSell = [];
priceBuy = [];
nameMomo = [];
timeChange = [];
flagID = false;
flagCountMomo = 0;

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function checkListed(address) {
    idMomo = [];
    indexMomo = [];
    priceSell = [];
    priceBuy = [];
    nameMomo = [];
    timeChange = [];
    flagID = false;
    flagCountMomo = 0;
    let response = await axios.get("https://nftapi.mobox.io/auction/list/BNB/" + address + "?sort=-time&page=1&limit=128").catch((e) => {
        console.log("Err1");
    });
    const data = response.data;
    for (let i = 0; i < data.list.length; i++) {
        idMomo.push(data.list[i].prototype);
        indexMomo.push(data.list[i].index);
        priceBuy.push(0);
        priceSell.push(Number(data.list[i].startPrice) / 10 ** 9);
        sumSell += Number(data.list[i].startPrice) / 10 ** 9;
        timeChange.push(Number(data.list[i].uptime));
    }
    for (let ii = 0; ii < idMomo.length; ii++) {
        flagID = false;
        if (Number(idMomo[ii]) < 40000) {
            for (let oo = 0; oo < momoID.length; oo++) {
                if (Number(momoID[oo]) == Number(idMomo[ii])) {
                    nameMomo.push(momoID[oo + 1].slice(0, momoID[oo + 1].length - 1));
                    if (Number(momoID[oo]) > 30000) {
                        sumMomoUNQ += 1;
                    } else if (Number(momoID[oo]) > 20000) {
                        sumMomoUCM += 1;
                    } else if (Number(momoID[oo]) > 10000) {
                        sumMomoCM += 1;
                    }
                    flagID = true;
                    break;
                }
            }
        }
        if (flagID == false) {
            nameMomo.push("##########");
        }
    }
    if (nameMomo.length == idMomo.length && idMomo.length == indexMomo.length && indexMomo.length == priceSell.length) {
        dataExcel = "";
        for (let ii = 0; ii < indexMomo.length; ii++) {
            dataExcel = dataExcel + nameMomo[ii] + "\t" + idMomo[ii] + "\t" + indexMomo[ii] + "\t" + priceSell[ii] + "\t \t" + priceBuy[ii] + "\t1" + "\n";
        }
        sumMomo += idMomo.length;
    }
    // await sleep(4000)
}

async function scanIndex(logData) {
    let amount = 0;
    let indexMomo2 = indexMomo.sort((a, b) => a - b);
    let indexList = "";
    for (let i = 0; i < 128; i++) {
        if (i != indexMomo2[i]) {
            if (amount == 0) {
                indexEmpty = i;
            }
            amount += 1;
            indexMomo2.splice(i, 0, i);
            if (amount == 6) {
                amount = 0;
                indexList = indexList + indexEmpty + ", ";
            }
        }
    }
    if (indexList) {
        console.log(logData + "\t" + indexList);
    } else console.log(logData + "\t" + "Auctions are full !!");
}

async function checkPriceBuy(address, page) {
    let response2 = await axios.get("https://nftapi.mobox.io/auction/logs_new/" + address + "?&page=" + page + "&limit=50").catch((e) => {
        console.log("Err2");
    });
    if (!response2) {
        console.log("Error connect to api");
        exit();
    }
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
        if (data2.list[i].bidder == address) {
            if (data2.list[i].amounts.length == 0) {
                for (let idx3 = 0; idx3 < idMomo.length; idx3++) {
                    if (Number(idMomo[idx3]) == Number(data2.list[i].tokens[0].prototype) && priceBuy[idx3] == 0) {
                        priceBuy[idx3] = Number(Number(data2.list[i].bidPrice) / 10 ** 9).toFixed(3);
                        sumBuy += Number(data2.list[i].bidPrice) / 10 ** 9;
                        flagCountMomo += 1;
                        break;
                    }
                }
            } else {
                for (let idx2 = 0; idx2 < data2.list[i].ids.length; idx2++) {
                    for (let maxIndex = 0; maxIndex < maxAmount; maxIndex++) {
                        for (let idx3 = 0; idx3 < idMomo.length; idx3++) {
                            if (idMomo[idx3] == data2.list[i].ids[idx2] && priceBuy[idx3] == 0) {
                                priceBuy[idx3] = Number(Number(data2.list[i].bidPrice) / 10 ** 9 / sum).toFixed(3);
                                sumBuy += Number(Number(data2.list[i].bidPrice) / 10 ** 9 / sum);
                                flagCountMomo += 1;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}

async function main(address, nameFile_, rate_) {
    let budget = await contract.methods.balanceOf(address).call();
    budget = (budget / 10 ** 18).toFixed(2);
    sumUSD += Number(budget);
    budget = (budget * rate_).toFixed(2);
    await checkListed(address);
    for (let index1 = 1; index1 < 51; index1++) {
        await checkPriceBuy(address, index1);
        if (flagCountMomo == idMomo.length) {
            // console.log('Break')
            break;
        }
        await sleep(100);
    }
    // await sleep(1000)
    if (nameMomo.length == idMomo.length && idMomo.length == indexMomo.length && indexMomo.length == priceSell.length) {
        dataExcel = "";
        momoListed += idMomo.length;
        amountAccount += 1;
        for (let ii = 0; ii < indexMomo.length; ii++) {
            let profit = Number(priceSell[ii] * 0.95 - (5.4 * 10 ** -9 * 500000 * bnbPrice) / 3 - 0.0583 - Number(priceBuy[ii])).toFixed(3); //0.0583 is fee list
            if (profit < 0) {
                countLoss += 1;
            } else if (profit > 0) {
                countProfit += 1;
            } else {
                countTie += 1;
            }
            dataExcel = dataExcel + nameMomo[ii] + "\t" + idMomo[ii] + "\t" + indexMomo[ii] + "\t" + priceSell[ii] + "\t" + timeChange[ii] + "\t" + priceBuy[ii] + "\t" + nameFile_ + "\t5.4\t" + profit + "\n";
        }
        // console.log(dataExcel)
        listed = listed + dataExcel;
        for (let index = idMomo.length; index < 128; index++) {
            dataExcel = dataExcel + "" + "\t" + "" + "\t" + "" + "\t" + "" + "\t" + "" + "\t" + "" + "\t\t" + "\n";
        }
        if (save == true) {
            fs.writeFile(nameFile_ + ".csv", dataExcel, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        }
        let space = "";
        if (Number(flagCountMomo) < 10) {
            space = "0";
        }
        let isContract = await web3.eth.getStorageAt(address);
        if (Number(isContract)) {
            let abiAmount = [
                {
                    inputs: [],
                    name: "amountUnList",
                    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                    stateMutability: "view",
                    type: "function",
                },
            ];
            let contractAcc = new web3.eth.Contract(abiAmount, address);
            let amountUnList = await contractAcc.methods.amountUnList().call();
            flagBalance = "amountUnList: " + amountUnList + "\t\t";
        }
        let logData = nameFile_ + "\t" + space + flagCountMomo.toString() + " vs " + space + idMomo.length.toString() + "\t" + budget + " USDT\t" + flagBalance;
        // if (balance * 1 != 0 && budget * 1 != 0 && flagCountMomo * 1 != 0) {
        scanIndex(logData);
        // }
        if (nameFile_ == lastAcc) {
            for (let index = momoListed; index < amountAccount * 128; index++) {
                listed = listed + "" + "\t" + "" + "\t" + "" + "\t" + "" + "\t" + "" + "\t" + "" + "\t\t" + "\n";
            }
            fs.writeFile("listed" + ".csv", listed, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        }
    }
}

async function checkListedAll(rate_) {
    // ip = await axios.get('https://ip.whatisproxy.net/').catch(e => { console.log("Err ip") })
    // console.log(ip.data)
    bnbPrice = await axios.get("https://priceapi.mobox.io/kline/usdt?coins=[%22bnb%22]").catch((e) => {
        console.log("Err1");
    });
    bnbPrice = Number(bnbPrice.data.data.bnb.price.toFixed(2));
    usdPrice = await axios.get("https://wise.com/rates/live?source=USD&target=VND&length=30&resolution=hourly&unit=day").catch((e) => {
        console.log("Err1");
    });
    usdPrice = Number(usdPrice.data.value.toFixed());
    for (let index = 0; index < myAcc.length; index++) {
        if (myAcc[index][2] == false) {
            continue;
        }
        let isContract = await web3.eth.getStorageAt(myAcc[index][0]);
        if (Number(isContract)) {
            await main(myAcc[index][0], myAcc[index][1], rate_);
        } else {
            let balance = Number(await web3.eth.getBalance(myAcc[index][0])) / 10 ** 18;
            let budget = Number(await contract.methods.balanceOf(myAcc[index][0]).call()) / 10 ** 18;
            sumBNB += balance;
            sumUSD += budget;
            if (myAcc[index][1] == "_1_0_1") {
                console.log("Changer: " + balance.toFixed(4), "BNB\t" + budget.toFixed(4), "USDT");
            }
            if (myAcc[index][1] == "_5_8_1") {
                console.log("Banker : " + balance.toFixed(4), "BNB\t" + budget.toFixed(4), "USDT");
            }
            if (myAcc[index][1] == "_7_7_1") {
                console.log("Buyer  : " + balance.toFixed(4), "BNB\t" + budget.toFixed(4), "USDT");
            }
        }
    }
    console.log("BNB Price:", bnbPrice);
    console.log("USD Price:", usdPrice);
    console.log("Total USDT:\t\t", (sumUSD * rate_).toFixed(2));
    console.log("Total BNB:\t\t", (sumBNB * rate_).toFixed(4));
    console.log("Total Fund:\t\t", ((sumBNB * bnbPrice + sumUSD) * usdPrice * rate_).toFixed());
    sumBuyVnd = (sumBNB * bnbPrice + sumUSD + sumBuy) * usdPrice * rate_;
    sumSaleVnd = (sumBNB * bnbPrice + sumUSD + sumSell * 0.95) * usdPrice * rate_;
    console.log("Estimate Fund:\t", sumBuyVnd.toFixed(), "--", sumSaleVnd.toFixed());
    console.log("Estimate Fund:\t", (sumBuyVnd + (sumSaleVnd - sumBuyVnd) * rateSale).toFixed());
    var currentdate = new Date();
    const nowSync = currentdate.getDate() + "/" + (Number(currentdate.getMonth()) + 1).toString() + "/" + currentdate.getFullYear();
    var datetime = "Last Sync: " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    console.log(
        sumMomo + " Momos: " + sumMomoCM + " Common, " + sumMomoUCM + " Uncommon, " + sumMomoUNQ + " Unique, " + sumMomoR + " Rare, " + sumMomoE + " Epic, " + sumMomoL + " Legend (" + sumBuy.toFixed() + ",",
        (sumSell * 0.95).toFixed() + ")",
        "Profit: " + countProfit + " - Loss: " + countLoss + " - Tie: " + countTie,
        datetime
    );
    var logsBalance = fs.readFileSync("logsBalance.csv", "utf8");
    var logsBalanceCheck = logsBalance.split("\n");
    logsBalanceCheck = logsBalanceCheck[logsBalanceCheck.length - 1].split("\t");
    const lastBalance = logsBalanceCheck[0];
    const lastSync = logsBalanceCheck[1];
    if (lastSync != nowSync) {
        console.log("New save");
        fs.writeFile("logsBalance" + ".csv", logsBalance + "\n" + (sumBuyVnd + (sumSaleVnd - sumBuyVnd) * rateSale).toFixed() + "\t" + nowSync, (err) => {
            if (err) {
                console.error(err);
            }
        });
    } else {
        if (Number(sumBuyVnd + (sumSaleVnd - sumBuyVnd) * rateSale) - Number(lastBalance) > 1) {
            // only save max
            console.log("Save max", Number(lastBalance).toFixed(), "to", Number(sumBuyVnd + (sumSaleVnd - sumBuyVnd) * rateSale).toFixed());
            logsBalanceCheck = logsBalance.split("\n");
            logsBalance = "";
            for (let index = 0; index < logsBalanceCheck.length - 1; index++) {
                var logEach = logsBalanceCheck[index].split("\t");
                logsBalance += logEach[0] + "\t" + logEach[1] + "\n";
            }
            logsBalance = logsBalance + (sumBuyVnd + (sumSaleVnd - sumBuyVnd) * rateSale).toFixed() + "\t" + nowSync;
            // for (let index = 0; index < 200; index++) {
            //     logsBalance += '\n'
            // }
            fs.writeFile("logsBalance.csv", logsBalance, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        } else {
            console.log("Don't save min");
        }
    }
}
const checkRightAccBuy = (arrayMyAcc, accRunRight) => {
    for (let index = 0; index < arrayMyAcc.length; index++) {
        if (accRunRight == arrayMyAcc[index][0]) {
            return true;
        }
    }
    return false;
};

const myAcc = configJson.myAcc;
const accRun = configJson.accBuy;
var listed = "";
var momoListed = 0,
    sumMomo = 0,
    countLoss = 0,
    countProfit = 0,
    countTie = 0,
    sumMomoCM = 0,
    sumMomoUCM = 0,
    sumMomoUNQ = 0,
    sumMomoR = 0,
    sumMomoE = 0,
    sumMomoL = 0,
    amountAccount = 0,
    sumSell = 0,
    sumBuy = 0,
    sumUSD = 0,
    sumBNB = 0;
const lastAcc = myAcc[myAcc.length - 1][1];
const save = false;
const rateSale = 0.42;

if (!checkRightAccBuy(myAcc, accRun)) {
    console.error("Acc buy is wrongs!!");
}
checkListedAll(0.1);
