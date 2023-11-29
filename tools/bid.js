require("dotenv").config();
const request = require("request");
const axios = require("axios");
const fs = require("fs");
const configJson = JSON.parse(fs.readFileSync("./config/config.json"));
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
const Web3 = require("web3");
const { exit } = require("process");
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Promise Rejection:", err);
});
// const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-testnet.publicnode.com"));
const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed3.bnbchain.org"));
// const web3sc = new Web3(new Web3.providers.WebsocketProvider('wss://solemn-wild-aura.bsc.discover.quiknode.pro/9fbdf28f69f47aa85c76222be804b4224c2dbd22/'));
const apiTele = process.env.api_telegram;
const chatId = process.env.chatId_mobox;
const abi = JSON.parse(fs.readFileSync("./config/abiMobox.json"));
const contractAddress = configJson.accBuy;
const contract = new web3.eth.Contract(abi, contractAddress);
async function setup(Private_Key_) {
    inputdata = "None";
    var isBid = false;
    try {
        const inputdata = fs.readFileSync("waitBid.txt", "utf8");
        dataBid = inputdata.split("\n");
        if (inputdata.length > 40) {
            isBid = true;
            for (let index = dataBid.length - 1; index >= 0; index--) {
                if (dataBid[index] == "\r" || dataBid[index] == "") {
                    dataBid.splice(index, 1);
                }
            }
        }
    } catch (err) {}
    if (isBid) {
        var timeSendReal = 0;
        const startTime_ = dataBid[3].split(",");
        const index_ = dataBid[2].split(",");
        if (index_[0] != "" && Date.now() / 1000 > Number(startTime_[0]) + timeSendTx - 15) {
            const seller_ = dataBid[0].split(",");
            const priceList = dataBid[1].split(",");
            const amountList = dataBid[5].split(",");
            const idList = dataBid[4].split(",");
            const gasPriceScanRaw = dataBid[6].split(",");
            var gasPriceScan = [];
            for (let index = 0; index < gasPriceScanRaw.length; index++) {
                gasPriceScan[index] = Number((Number(gasPriceScanRaw[index]) * 10 ** 9).toFixed());
            }
            // const gasPriceScanFake = Number((Number(dataBid[6].split(",")) * 10 ** 9 * 2).toFixed());
            let amountBid = 0;
            for (let index = 0; index < amountList.length; index++) {
                amountBid += Number(amountList[index]);
            }
            if (false || Number(startTime_[0]) + timeSendTx + overTime - Date.now() / 1000 > 0) {
                //       Number(startTime_[0]) + timeSendTx            - Date.now() / 1000 > 0
                var tx = [];
                let nonce_ = await web3.eth.getTransactionCount(acc.address);
                if (index_.length > 1) {
                    for (let index = 0; index < index_.length; index++) {
                        tx.push({
                            from: acc.address,
                            gas: 1000000,
                            gasPrice: gasPriceScan[index],
                            nonce: nonce_,
                            to: contractAddress,
                            value: 0,
                            data: contract.methods.bid(seller_[index].toString(), index_[index].toString(), startTime_[index].toString(), priceList[index].toString(), "1").encodeABI(), // amount = 1
                        });
                        nonce_ += 1;
                    }
                } else if (index_.length == 1) {
                    tx.push({
                        from: acc.address,
                        gas: 1000000,
                        gasPrice: gasPriceScan[0],
                        nonce: nonce_,
                        to: contractAddress,
                        value: 0,
                        data: contract.methods.bid(seller_.toString(), index_.toString(), startTime_.toString(), priceList.toString(), amountBid.toString()).encodeABI(), // amount = 1 or > 1
                    });
                }
                let checkSuccess = "Success";
                let isAvailableAuctions = true;
                let checkHashEach = "";
                try {
                    let signed = [];
                    let biding = [];
                    for (let index = 0; index < tx.length; index++) {
                        signed.push(await web3.eth.accounts.signTransaction(tx[index], Private_Key_));
                    }
                    if (Number(startTime_[0]) + timeSendTx - Date.now() / 1000 > 0) {
                        await sleep(Number(startTime_[0]) + timeSendTx - timeGetAvaliableAuction - Date.now() / 1000);
                        isAvailableAuctions = await checkAvailable(seller_[0], index_[0], startTime_[0]);
                        if (isAvailableAuctions) {
                            console.log("Sleep:" + (Number(startTime_[0]) + timeSendTx - Date.now() / 1000).toFixed(3));
                            await sleep(Number(startTime_[0]) + timeSendTx - Date.now() / 1000);
                        }
                    } else {
                        // maybe bug here
                        isAvailableAuctions = await checkAvailable(seller_[0], index_[0], startTime_[0]);
                    }
                    console.log("Paying!!");
                    try {
                        if (dataBid.length < 14) {
                            checkHashEach = signed[0].transactionHash;
                        }
                    } catch (error) {
                        console.log("check hash fail");
                    }
                    for (let index = 0; index < tx.length; index++) {
                        if (!isAvailableAuctions) {
                            break;
                        }
                        if (tx.length == 1) {
                            try {
                                checkSuccess = "Success";
                                const sendEach = await web3.eth.sendSignedTransaction(signed[index].rawTransaction);
                                console.log("Successful bid! At block:", sendEach.blockNumber);
                            } catch (error) {
                                console.log("Fail...setting new time");
                                // console.log(error);
                                // console.log("Bid fail! At block: " + error.receipt.blockNumber);
                                checkSuccess = "Fail";
                                // timeSendReal = error.receipt.blockNumber;
                            }
                        } else {
                            if (index == tx.length - 1) {
                                try {
                                    checkSuccess = "Success";
                                    biding[index] = await web3.eth.sendSignedTransaction(signed[index].rawTransaction);
                                } catch (error) {
                                    console.log("Bid fail");
                                    checkSuccess = "Fail";
                                }
                                console.log("Successful bid! At block:", biding[index].blockNumber);
                            } else {
                                try {
                                    checkSuccess = "Success";
                                    biding[index] = web3.eth.sendSignedTransaction(signed[index].rawTransaction);
                                } catch (error) {
                                    console.log("Bid fail");
                                    checkSuccess = "Fail";
                                    next(error);
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.log("Error during bid Auction!");
                    checkSuccess = "Fail";
                }
                await sleep(1000);
                for (let op = 0; op < idList.length; op++) {
                    idList[op] = idList[op].slice(0, 1);
                }
                try {
                    let price_send = [];
                    for (let q = 0; q < priceList.length; q++) {
                        price_send.push(" " + ((Number(priceList[q]) - 10 ** 14) / 10 ** 18).toFixed(2));
                    }
                    priceList1 = checkSuccess + " " + gasPriceScanRaw + "\nPrices   : " + price_send.toString().replace(" ", "") + "\nAmount: " + amountList + "\nID List   : " + idList;
                    if (!isAvailableAuctions) {
                        priceList1 = `Auction be canceled by ${seller_[0]}`;
                        console.log(priceList1);
                    }
                } catch (error) {}
                try {
                    if (checkHashEach) {
                        await sleep(1000); //sleep to avoid pending hash
                        timeSendReal = await web3.eth.getTransaction(checkHashEach);
                        timeSendReal = await web3.eth.getBlock(timeSendReal.blockNumber);
                        timeSendReal = timeSendReal.timestamp;
                        console.log("timeStampFail:", timeSendReal);
                    }
                    if (timeSendReal.toFixed() != (Number(startTime_[0]) + 120).toFixed() && timeSendReal > 1.7 * 10 ** 9) {
                        const oldTimeBid = timeSendTx;
                        if (Math.abs(Number(startTime_[0]) + 120 - timeSendReal) < 3600) {
                            if (timeSendReal < Number(startTime_[0]) + 120 || timeSendReal - (Number(startTime_[0]) + 120) > 10) {
                                timeSendTx = timeSendTx + (Number(startTime_[0]) + 120 - timeSendReal);
                                console.log("timeSend");
                            } else {
                                timeSendTx = timeSendTx + (Number(startTime_[0]) + 120 - timeSendReal) / 2;
                                console.log("timeSend / 2");
                            }
                        }
                        const contentTimeBid = `Expect: ${(Number(startTime_[0]) + 120).toFixed().slice(8, 10)}\nResult: ${timeSendReal.toFixed().slice(8, 10)}\nOld: ${oldTimeBid.toFixed(2)}\nNew: ${timeSendTx.toFixed(2)}`;
                        request("https://api.telegram.org/" + apiTele + "/sendMessage?chat_id=@" + chatId + "&text=" + contentTimeBid, function (error, response, body) {});
                    }
                } catch (error) {
                    console.log(error);
                }
                try {
                    request("https://api.telegram.org/" + apiTele + "/sendMessage?chat_id=@" + chatId + "&text=" + priceList1, function (error, response, body) {});
                } catch (error) {}
            } else {
                console.log("Over time (" + overTime.toString() + " seconds)!!");
            }
            try {
                const inputdata = fs.readFileSync("waitBid.txt", "utf8");
                dataBid = inputdata.split("\n");
                for (let index = dataBid.length - 1; index >= 0; index--) {
                    if (dataBid[index] == "\r" || dataBid[index] == "") {
                        dataBid.splice(index, 1);
                    }
                }
            } catch (err) {}
            dataBid.splice(0, 7);
            let content = "";
            for (let iii = 0; iii < dataBid.length; iii++) {
                if (iii == 0) {
                    content += dataBid[iii].toString();
                } else {
                    content += "\n" + dataBid[iii].toString();
                }
            }
            if (dataBid.length) {
                content += "\n";
            }
            fs.writeFile("waitBid.txt", content, (err) => {
                if (err) {
                    console.error(err);
                }
            });
            await sleep(1000);
        }
    }
}
async function bid() {
    try {
        const passData = fs.readFileSync("myAccount_5_8_1.txt", "utf8");
        myAccount = passData.split("\n");
    } catch (err) {
        console.error(err);
    }
    const Private_Key = myAccount[1];
    acc = web3.eth.accounts.privateKeyToAccount(Private_Key);
    console.log(acc.address);
    let hourCache = new Date().getHours() - 4;
    while (true) {
        await setup(Private_Key);
        await sleep(100);
        if (Math.abs(new Date().getHours() - hourCache) >= 4) {
            try {
                hourCache = new Date().getHours();
                request(`https://api.telegram.org/${apiTele}/sendMessage?chat_id=@${chatId}&text=Status: alive\nTime: ${timeSendTx}`, function (error, response, body) {});
            } catch (error) {
                console.log("Send status fail");
            }
        }
    }
}
const checkAvailable = async (addressCheck, indexCheck, timeCheck) => {
    // true is available
    let responseListed = await axios.get("https://nftapi.mobox.io/auction/list/BNB/" + addressCheck + "?sort=-time&page=1&limit=30").catch((e) => {
        return true;
    });
    let dataAvailable = responseListed.data.list;
    for (let index = 0; index < dataAvailable.length; index++) {
        if (Number(indexCheck) == dataAvailable[index].index && Number(timeCheck) == dataAvailable[index].uptime) {
            return true;
        }
    }
    return true;
};

const overTime = 60;
const timeGetAvaliableAuction = 5;
// const timeSendTx = 73.6 - 20; //time wait to buy (40 block ~ 120s)1:117 - may buy early, now test 117.2bid();
var timeSendTx = configJson.timeBid;
bid();
