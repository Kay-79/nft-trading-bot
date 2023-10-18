require("dotenv").config();
var axios = require("axios");
const fs = require("fs");
const { exit } = require("process");
const Web3 = require("web3");
const request = require("request");
const web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.ankr.com/bsc"));
const abiBUSD = [
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
];
const configJson = JSON.parse(fs.readFileSync("./config/config.json"));
const addressToken = configJson.addressToken;
const contract = new web3.eth.Contract(abiBUSD, addressToken);

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function getMpListed(amountMomo) {
    auctors_ = [];
    nowPrices_ = [];
    priceDec_ = [];
    hashrates_ = [];
    lvHashrate_ = [];
    lvMomo_ = [];
    buyMode = [];
    indexs_ = [];
    uptimes_ = [];
    ids_ = [];
    amounts_ = [];
    try {
        let mpListed = await axios.get("https://nftapi.mobox.io/auction/search_v2/BNB?page=1&limit=" + amountMomo + "&category=&vType=&sort=-time&pType=");
        mpListed = mpListed.data.list;
        for (let ii = mpListed.length - 1; ii >= 0; ii--) {
            auctors_.push(mpListed[ii].auctor);
            nowPrices_.push(mpListed[ii].nowPrice);
            priceDec_.push(Number((Number(mpListed[ii].nowPrice) / 10 ** 9).toFixed(2)));
            indexs_.push(mpListed[ii].index);
            uptimes_.push(mpListed[ii].uptime);
            hashrates_.push(mpListed[ii].hashrate);
            lvHashrate_.push(mpListed[ii].lvHashrate);
            lvMomo_.push(mpListed[ii].level);
            if (mpListed[ii].ids.length == 0) {
                //>>>>=Rare
                amounts_.push(["1"]);
                ids_.push([mpListed[ii].prototype.toString()]);
            } else {
                amounts_.push(mpListed[ii].amounts);
                ids_.push(mpListed[ii].ids);
            }
        }
        for (let indexx = 0; indexx < uptimes_.length; indexx++) {
            if (Number(hashrates_[indexx]) >= 10) {
                //Pro
                buyMode.push("Pro");
            } else if (Number(hashrates_[indexx]) < 10) {
                //Normal
                if (Number(amounts_[indexx][0]) > 1 || amounts_[indexx].length > 1) {
                    buyMode.push("Bundle");
                } //Bundle
                else {
                    buyMode.push("Normal");
                }
            }
        }
    } catch (error) {
        var currentdate = new Date();
        var datetime = "Last Sync: " + currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
        console.log("Connect to api failed and wait 2 minutes!", datetime);
        await sleep(120000);
    }
}

function checkIdPrice(idCheck_, amountCheck_, lvCheck_, lvHashCheck_) {
    //check each momo
    let priceCheck = 0;
    switch (idCheck_.slice(0, 1)) {
        case "1":
            priceCheck = minCommon * Number(amountCheck_);
            break;
        case "2":
            priceCheck = minUncommon * Number(amountCheck_);
            break;
        case "3":
            priceCheck = minUnique * Number(amountCheck_);
            break;
        case "4":
            priceCheck = minRare;
            break;
        case "5":
            priceCheck = minEpic;
            break;
        case "6":
            priceCheck = minLegend;
            break;
        default:
            break;
    }
    for (let index = 0; index < idMomo.length; index++) {
        if (Number(idCheck_) > 40000) {
            break;
        }
        if (Number(idCheck_) == Number(idMomo[index])) {
            if (priceCheck < Number(priceMomo[index]) * 0.95 - profitName && Number(priceMomo[index]) < maxMomoPrice) {
                priceCheck = Number(priceMomo[index]) * 0.95 - profitName;
            }
        }
    }
    if (pricePerHash * lvHashCheck_ > priceCheck && pricePerHash * lvHashCheck_ < budget) {
        priceCheck = pricePerHash * lvHashCheck_;
    }
    return priceCheck;
}

async function checkCanBuy() {
    indexCanBuy = [];
    profitCanBuy = [];
    modeCanBuy = [];
    for (let indexx = 0; indexx < uptimes_.length; indexx++) {
        switch (buyMode[indexx]) {
            case "Bundle":
                let priceBundle = 0;
                for (let indexIds_ = 0; indexIds_ < ids_[indexx].length; indexIds_++) {
                    priceBundle += checkIdPrice(ids_[indexx][indexIds_], amounts_[indexx][indexIds_], "lv not in bundle", "lvHP not in bundle");
                }
                if (priceBundle >= priceDec_[indexx]) {
                    indexCanBuy.push(indexx);
                    profitCanBuy.push(priceBundle - priceDec_[indexx]);
                    modeCanBuy.push("Bundle");
                }
                break;
            case "Normal":
                if (checkIdPrice(ids_[indexx][0], 1, "lv not in normal", "lvHP not in normal") >= priceDec_[indexx]) {
                    indexCanBuy.push(indexx);
                    profitCanBuy.push(checkIdPrice(ids_[indexx][0], 1, "lv not in normal", "lvHP not in normal") - priceDec_[indexx]);
                    modeCanBuy.push("Normal");
                }
                break;
            case "Pro":
                if (checkIdPrice(ids_[indexx][0], 1, lvMomo_[indexx], lvHashrate_[indexx]) >= priceDec_[indexx]) {
                    indexCanBuy.push(indexx);
                    profitCanBuy.push(checkIdPrice(ids_[indexx][0], 1, lvMomo_[indexx], lvHashrate_[indexx]) - priceDec_[indexx]);
                    modeCanBuy.push("Pro");
                }
                break;
            default:
                console.log("Err");
                break;
        }
    }
}

async function saveWaitBuy(seller__, price__, index__, time__, tokenId__, amount__) {
    if (totalAuctions < 2) {
        if (totalProfit - fee[totalAuctions - 1] > 0) {
            try {
                // add save second file
                let gasPriceNew = 0;
                gasPriceNew = Number(((rateFeePerProfit * (totalProfit - fee[totalAuctions - 1])) / (gasUsed[totalAuctions - 1] * bnbPrice * 10 ** -9) + gasPriceMin).toFixed(3));
                if (gasPriceNew > gasPriceMax) {
                    gasPriceNew = gasPriceMax;
                }
                console.log("Estimate profit:", ((totalProfit - fee[totalAuctions - 1]) * 0.9).toFixed(2));
                console.log(tokenId__, amountDivide);
                var inputdata = fs.readFileSync(linkSave, "utf8");
                await sleep(25);
                var content = inputdata + seller__ + "\n" + price__ + "\n" + index__ + "\n" + time__ + "\n" + tokenId__ + "\n" + amount__ + "\n" + gasPriceNew + "\n";
                fs.writeFile(linkSave, content, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
                await sleep(25);
            } catch (err) {
                console.error(err);
            }
            await sleep(1000);
        } else {
            console.log("Profit < 0", totalProfit ? totalProfit - fee[totalAuctions - 1] : 0);
        }
    } else {
        for (let index = seller__.length - 1; index >= 0; index--) {
            // bug here -> fixed -> testing
            if (profitCanBuy[index] - fee[0] < 0) {
                console.log("Remove momo don't have profit");
                seller__.splice(index, 1);
                price__.splice(index, 1);
                index__.splice(index, 1);
                time__.splice(index, 1);
                amount__.splice(index, 1);
                tokenId__.splice(index, 1);
                profitCanBuy.splice(index, 1);
            }
        }
        let gasPriceNew = [];
        for (let index = 0; index < seller__.length; index++) {
            gasPriceNew[index] = Number(((rateFeePerProfit * (profitCanBuy[index] - fee[0])) / (gasUsed[0] * bnbPrice * 10 ** -9) + gasPriceMin).toFixed(3));
            if (gasPriceNew[index] > gasPriceMax) {
                gasPriceNew[index] = gasPriceMax;
            }
        }
        try {
            console.log(tokenId__, tokenId__.length);
            if (tokenId__.length) {
                var inputdata = fs.readFileSync(linkSave, "utf8");
                await sleep(25);
                var content = inputdata + seller__ + "\n" + price__ + "\n" + index__ + "\n" + time__ + "\n" + tokenId__ + "\n" + amount__ + "\n" + gasPriceNew + "\n";
                fs.writeFile(linkSave, content, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
                await sleep(25);
            }
        } catch (error) {}
    }
}
function resetVar() {
    amountDivide = 0;
    seller_ = [];
    price_ = [];
    index_ = [];
    time_ = [];
    tokenId_ = [];
    amount_ = [];
    totalProfit = 0;
    totalAuctions = 0;
}

async function divideCanBuy() {
    resetVar();
    for (let index = 0; index < indexCanBuy.length; index++) {
        if (Number(uptimes_[indexCanBuy[index]]) >= uptimesCache) {
            if (Number(uptimes_[indexCanBuy[index]]) > uptimesCache) {
                if (seller_.length > 0) {
                    await saveWaitBuy(seller_, price_, index_, time_, tokenId_, amount_);
                    resetVar();
                }
            } else if (Number(uptimes_[indexCanBuy[index]]) == uptimesCache) {
                if (amountDivide > 5) {
                    //5 for bidBatch, 0 for bid
                    await saveWaitBuy(seller_, price_, index_, time_, tokenId_, amount_);
                    resetVar();
                }
            }
            let addressIdCache_ = auctors_[indexCanBuy[index]] + "_" + indexs_[indexCanBuy[index]] + "_" + ids_[indexCanBuy[index]] + "_" + amounts_[indexCanBuy[index]];
            if (addressIdCache.includes(addressIdCache_)) {
                continue;
            } //Avoid save same auctions
            amountDivide += 1;
            uptimesCache = Number(uptimes_[indexCanBuy[index]]);
            seller_.push(auctors_[indexCanBuy[index]]);
            price_.push(Number(nowPrices_[indexCanBuy[index]] + 10 ** 5).toFixed() + "000000000");
            index_.push(indexs_[indexCanBuy[index]]);
            time_.push(uptimes_[indexCanBuy[index]]);
            tokenId_.push(ids_[indexCanBuy[index]]);
            amount_.push(amounts_[indexCanBuy[index]]);
            totalProfit += profitCanBuy[index];
            totalAuctions += 1;
            addressIdCache.push(addressIdCache_);
            addressIdCache.shift();
        }
    }
    if (seller_.length > 0) {
        await saveWaitBuy(seller_, price_, index_, time_, tokenId_, amount_);
        resetVar();
    }
}

async function runBot(amountMomo) {
    bnbPrice = await axios.get("https://priceapi.mobox.io/kline/usdt?coins=[%22bnb%22]").catch((e) => {
        console.log("Err1");
    });
    bnbPrice = bnbPrice.data.data.bnb.price;
    if (rateFeePerProfit > 0.5) {
        console.warn("Rate fee too high");
        exit();
    }
    await setup();
    let flagCheck = 0;
    while (true) {
        flagCheck += 1;
        await getMpListed(amountMomo);
        if (auctors_.length == 0) {
            await sleep(12000 + 10000 * Math.random());
            continue;
        }
        await sleep(1000);
        await checkCanBuy();
        await divideCanBuy();
        await sleep(12000 + 10000 * Math.random());
        if (flagCheck >= 53) {
            //1 loop around 11.37 seconds // 106 ~ 20 minutes
            flagCheck = 0;
            await getMinPrice();
        }
    }
}

async function setup() {
    //setup const
    amountDivide = 0;
    seller_ = [];
    price_ = [];
    index_ = [];
    time_ = [];
    tokenId_ = [];
    amount_ = [];
    totalProfit = 0;
    totalAuctions = 0;
    uptimesCache = 0;
    addressIdCache = Array(30);
    linkSave = "./waitBid.txt";
    gasUsed = [242000, 344000, 460000, 575000, 690000, 800000]; //Const avg gasUsed
    gasUsed = [242000 * 1, 242000 * 2, 242000 * 3, 242000 * 4, 242000 * 5, 242000 * 6]; //Const avg gasUsed
    await getMinPrice(); //setup change
}

async function getMinPrice() {
    try {
        budget = await contract.methods.balanceOf(accCheck).call();
        budget = budget / 10 ** 18;
        if (budget != budgetCache) {
            console.log("New budget:", budget.toFixed(3));
            budgetCache = budget;
            if (budget < minBudget) {
                console.warn("Insufficient funds");
                request("https://api.telegram.org/" + apiTele + "/sendMessage?chat_id=@" + chatId + "&text=Insufficient funds", function (error, response, body) {});
                await sleep(10000);
                exit();
            }
        }
    } catch (error) {
        console.log("Err check BUSD!!");
        console.log(error);
    }
    dataMomo = fs.readFileSync("data/dataMomo.txt", "utf8");
    dataMomo = dataMomo.split("\n");
    for (let index = 0; index < dataMomo.length; index += 3) {
        if (Number(dataMomo[index]) > 0) {
            idMomo.push(dataMomo[index]);
            nameMomo.push(dataMomo[index + 1]);
            priceMomo.push(dataMomo[index + 2]);
        }
    }
    for (let index0 = 0; index0 < 3; index0++) {
        let limitMomo = 17;
        if (index0 >= 4) {
            limitMomo = 5;
        }
        let dataMin = await axios.get("https://nftapi.mobox.io/auction/search_v2/BNB?page=1&limit=" + limitMomo + "&category=&vType=" + (index0 + 1).toString() + "&sort=price&pType=").catch((e) => {
            console.log("Err get min price!!");
        });
        if (!dataMin) {
            index0 -= 1;
            await sleep(5000);
            continue;
        }
        await sleep(2500);
        let amountMinCheck = 0;
        let sumMin = 0;
        let sumMin2 = 0;
        dataMin = dataMin.data.list;
        for (let index = 0; index < dataMin.length; index++) {
            if (Date.now() / 1000 - dataMin[index].uptime > 900) {
                amountMinCheck += 1;
                sumMin += dataMin[index].nowPrice / 10 ** 9;
            } else {
                sumMin2 += dataMin[index].nowPrice / 10 ** 9;
            }
            if (amountMinCheck >= 5) {
                break;
            }
        }
        if (amountMinCheck >= 5) {
            priceRaw[index0] = sumMin / amountMinCheck;
        } else {
            priceRaw[index0] = (sumMin + sumMin2) / dataMin.length;
        }
    }
    for (let index = 0; index < 3; index++) {
        if (priceRaw[index] > 10) {
            console.log("Error Normal Price!!");
            exit();
        }
    }
    if (priceRaw[3] > 25 || priceRaw[4] > 100 || priceRaw[5] > 1000) {
        console.log("Error Pro Price!!");
        exit();
    }
    if (pricePerHash > 0.1) {
        console.log("Error Hash Price!!");
        exit();
    }
    price = [];
    for (let index = 0; index < profit.length; index++) {
        if (profit[index] < 0) {
            console.warn("Wrong profit");
            exit();
        }
        price.push(Number((priceRaw[index] * 0.95 - profit[index] - 0.06).toFixed(3)));
    }
    minCommon = price[0];
    minUncommon = price[1];
    minUnique = price[2];
    minRare = price[3];
    minEpic = price[4];
    minLegend = price[5];
    minRare = 0;
    minEpic = 0;
    minLegend = 0;
    console.log(minCommon, minUncommon, minUnique, minRare, minEpic, minLegend);
    fee = gasUsed.map((valuee) => valuee * gasPriceMin * bnbPrice * 10 ** -9); //min fee to buy
}

var priceRaw = [0, 0, 0, 0, 0, 1000]; //lowest price in MP
const profit = [0.0, 0.0, 0.0, 4, 8, 100]; //profit per mom
const profitName = 30;
var minCommon, minUncommon, minUnique, minRare, minEpic, minLegend;
var idMomo = [];
var nameMomo = [];
var priceMomo = [];
const pricePerHash = 0;
var budgetCache = -1;
const minBudget = 30;
const gasPriceMin = 3.1;
const gasPriceMax = 50;
const rateFeePerProfit = 0.2;
var accCheck = configJson.accBuy;
const apiTele = process.env.api_telegram;
const chatId = process.env.chatId_mobox;
const delayGetMp = 12000 + 10000 * Math.random(); // not use, around 17s per rq
// now is save batch, config in bid.js
const maxMomoPrice = 15;
runBot(20);
