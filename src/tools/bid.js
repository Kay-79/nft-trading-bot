require("dotenv").config();
const request = require("request");
const fs = require("fs");
const getBnbPrice = require("../utils/common/getBnbPrice");
const checkAvailable = require("../utils/bid/checkAvailable");
const checkEnemy = require("../utils/bid/checkEnemy");
const configJson = require("../config/config");
const { sleep, ranSleep } = require("../utils/common/sleep");
const Web3 = require("web3");
// const web3 = new Web3(new Web3.providers.WebsocketProvider(configJson.wss.private));
const web3 = new Web3(new Web3.providers.HttpProvider(configJson.rpcs.bid));
const web3rpc = new Web3(new Web3.providers.HttpProvider(configJson.rpcs.bid));
// const web3rpc = new Web3(new Web3.providers.HttpProvider(configJson.rpcs.protect));
// const web3 = new Web3(new Web3.providers.WebsocketProvider(configJson.wss.mainnet));
// const web3rpc = new Web3(new Web3.providers.HttpProvider(configJson.rpcs.public));
const { exit } = require("process");
process.on("unhandledRejection", err => {
    console.error("Unhandled Promise Rejection:", err);
    try {
        hashCheckStatus.push(err.receipt.transactionHash);
    } catch (error) {
        console.log("Add hash fail");
    }
});
let maxGasPiceEnemy = "";
let bnbPrice = 0;
const apiTele = process.env.API_TELEGRAM;
const chatId = process.env.CHATID_MOBOX;
const abi = JSON.parse(fs.readFileSync("./src/abi/abiMobox.json"));
const contractAddress = configJson.accBuy;
const contract = new web3rpc.eth.Contract(abi, contractAddress);
const overTime = 360;
const timeGetAvaliableAuction = 5;
const minGasPrice = configJson.gasPrices.minBid;
let timeSendTx = configJson.timeBid;
const emoji = configJson.emojiURL;
const Tx = require("ethereumjs-tx").Transaction;
const privateKey = Buffer.from(process.env.PRIVATE_KEY_BID_MAINNET, "hex");
const common = require("ethereumjs-common");
const getBlockByTime = require("../utils/bid/getBlockByTime");
let isFrontRun = false;
const chain = common.default.forCustomChain(
    "mainnet",
    {
        name: "bnb",
        networkId: 56,
        chainId: 56
    },
    "petersburg"
);
// const getPendingTransactions = web3.eth.subscribe("pendingTransactions", (err, res) => {
//     if (err) console.error(err);
// });
let txResend = {
    from: configJson.bidder,
    gas: 1000000,
    gasPrice: 0, //change with new gas price
    nonce: 0, //change with new nonce
    to: contractAddress,
    value: 0,
    data: "" //change with new data
};
let maxGasPricePerFee = "0";
let hashCheckStatus = [];
let baseGasPrice = 0;
let checkSuccess = "Non set";
async function setup(Private_Key_) {
    inputdata = "None";
    let isBid = false;
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
        let timeSendReal = 0;
        let priceList1 = "";
        const startTime_ = dataBid[3].split(",");
        let blockCreate = 0;
        const index_ = dataBid[2].split(",");
        if (index_[0] != "" && Date.now() / 1000 > Number(startTime_[0]) + timeSendTx - 30) {
            try {
                blockCreate = await getBlockByTime(web3rpc, Number(startTime_[0]), 3);
            } catch (error) {
                request(
                    "https://api.telegram.org/" +
                        apiTele +
                        "/sendMessage?chat_id=@" +
                        chatId +
                        "&text=Error get block by time, plese check private node",
                    function (error, response, body) {}
                );
                await sleep(10000);
                exit();
            }
            const seller_ = dataBid[0].split(",");
            const priceList = dataBid[1].split(",");
            const amountList = dataBid[5].split(",");
            const idList = dataBid[4].split(",");
            const gasPriceScanRaw = dataBid[6].split(",");
            if (gasPriceScanRaw.length == 1) {
                maxGasPricePerFee = (
                    ((Number(gasPriceScanRaw[0]) - minGasPrice) / configJson.rateFee) *
                        configJson.rateMax +
                    minGasPrice
                ).toFixed(3);
            }
            let gasPriceScan = [];
            for (let index = 0; index < gasPriceScanRaw.length; index++) {
                gasPriceScan[index] = Number((Number(gasPriceScanRaw[index]) * 10 ** 9).toFixed());
            }
            let amountBid = 0;
            for (let index = 0; index < amountList.length; index++) {
                amountBid += Number(amountList[index]);
            }
            if (false || Number(startTime_[0]) + timeSendTx + overTime - Date.now() / 1000 > 0) {
                let tx = [];
                let nonce_ = await web3rpc.eth.getTransactionCount(acc.address);
                if (index_.length > 1) {
                    for (let index = 0; index < index_.length; index++) {
                        tx.push({
                            from: acc.address,
                            gas: 1000000,
                            gasPrice: gasPriceScan[index],
                            nonce: nonce_,
                            to: contractAddress,
                            value: 0,
                            data: contract.methods
                                .bid(
                                    seller_[index].toString(),
                                    index_[index].toString(),
                                    startTime_[index].toString(),
                                    priceList[index].toString()
                                )
                                .encodeABI()
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
                        data: contract.methods
                            .bid(
                                seller_.toString(),
                                index_.toString(),
                                startTime_.toString(),
                                priceList.toString()
                            )
                            .encodeABI() // amount = 1 or > 1
                    });
                    baseGasPrice = gasPriceScan[0];
                    txResend.nonce = nonce_;
                    txResend.data = contract.methods
                        .bid(
                            seller_.toString(),
                            index_.toString(),
                            startTime_.toString(),
                            priceList.toString()
                        )
                        .encodeABI();
                    txResend.gasPrice = gasPriceScan[0];
                }
                checkSuccess = emoji.success;
                let isAvailableAuctions = true;
                try {
                    let signed = [];
                    let biding = [];
                    for (let index = 0; index < tx.length; index++) {
                        signed.push(
                            await web3.eth.accounts.signTransaction(tx[index], Private_Key_)
                        );
                    }
                    hashCheckStatus.push(signed[0].transactionHash);
                    if (Number(startTime_[0]) + timeSendTx - Date.now() / 1000 > 0) {
                        await sleep(
                            Number(startTime_[0]) +
                                timeSendTx -
                                timeGetAvaliableAuction -
                                Date.now() / 1000
                        );
                        isAvailableAuctions = await checkAvailable(
                            seller_[0],
                            index_[0],
                            startTime_[0]
                        );
                        if (isAvailableAuctions) {
                            // console.log(
                            //     "Sleep:" +
                            //         (
                            //             Number(startTime_[0]) +
                            //             timeSendTx -
                            //             Date.now() / 1000
                            //         ).toFixed(3)
                            // );
                            // await sleep(Number(startTime_[0]) + timeSendTx - Date.now() / 1000);
                            while (true) {
                                nowBlock = await web3rpc.eth.getBlockNumber();
                                if (blockCreate + 38 <= nowBlock) {
                                    //control time to send here
                                    await sleep(3500);
                                    isFrontRun = true;
                                    break;
                                }
                                if (Math.abs(blockCreate - nowBlock) > 100) {
                                    break;
                                }
                                await sleep(100);
                            }
                        }
                    } else {
                        isAvailableAuctions = await checkAvailable(
                            seller_[0],
                            index_[0],
                            startTime_[0]
                        );
                    }
                    console.log("Paying!!");
                    for (let index = 0; index < tx.length; index++) {
                        if (!isAvailableAuctions) {
                            break;
                        }
                        if (tx.length == 1) {
                            try {
                                checkSuccess = emoji.success;
                                const sendEach = /** await */ web3rpc.eth.sendSignedTransaction(
                                    signed[index].rawTransaction
                                );
                            } catch (error) {
                                console.log("Fail...setting new time");
                                checkSuccess = emoji.fail;
                            }
                            await sleep(7000);
                            isFrontRun = false;
                            txResend.data = "";
                            baseGasPrice = 0;
                            txResend.gasPrice = 0;
                        } else {
                            if (index == tx.length - 1) {
                                try {
                                    checkSuccess = emoji.success;
                                    biding[index] = await web3.eth.sendSignedTransaction(
                                        signed[index].rawTransaction
                                    );
                                } catch (error) {
                                    console.log("Bid fail");
                                    checkSuccess = emoji.fail;
                                }
                                console.log("Successful bid! At block:", biding[index].blockNumber);
                            } else {
                                try {
                                    checkSuccess = emoji.success;
                                    biding[index] = web3.eth.sendSignedTransaction(
                                        signed[index].rawTransaction
                                    );
                                } catch (error) {
                                    console.log("Bid fail");
                                    checkSuccess = emoji.fail;
                                    next(error);
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.log("Error during bid Auction!");
                    console.log(error);
                    checkSuccess = emoji.fail;
                }
                await sleep(1000);
                for (let op = 0; op < idList.length; op++) {
                    idList[op] = idList[op].slice(0, 1);
                }
                let cacheMaxGasPricePerFee;
                try {
                    let price_send = [];
                    for (let q = 0; q < priceList.length; q++) {
                        price_send.push(
                            " " + ((Number(priceList[q]) - 10 ** 14) / 10 ** 18).toFixed(2)
                        );
                    }
                    priceList1 = ` ${gasPriceScanRaw}-${maxGasPricePerFee}\nPrices   : ${price_send
                        .toString()
                        .replace(" ", "")}\nAmount: ${amountList}\nID List   : ${idList}`;
                    cacheMaxGasPricePerFee = maxGasPricePerFee;
                    maxGasPricePerFee = "0";
                    if (!isAvailableAuctions) {
                        priceList1 = `Auction be canceled by ${seller_[0].slice(
                            0,
                            6
                        )}...${seller_[0].slice(38, 42)}`;
                        txResend.data = "";
                        baseGasPrice = 0;
                        txResend.gasPrice = 0;
                        hashCheckStatus = [];
                        console.log(priceList1);
                    }
                } catch (error) {}
                try {
                    if (hashCheckStatus.length) {
                        let receiptCheckStatus = "";
                        let maxGasSent;
                        await sleep(1500); //sleep to avoid pending hash
                        for (let i = 0; i < hashCheckStatus.length; i++) {
                            receiptCheckStatus = await web3.eth.getTransactionReceipt(
                                hashCheckStatus[i]
                            );
                            if (!receiptCheckStatus) continue;
                            if (receiptCheckStatus.status) {
                                priceList1 = `${emoji.success} ${priceList1}`;
                                break;
                            } else {
                                priceList1 = `${emoji.fail} ${priceList1}`;
                                break;
                            }
                        }
                        maxGasSent = (
                            Number(receiptCheckStatus.effectiveGasPrice) /
                            10 ** 9
                        ).toFixed(3);
                        let profitBundle;
                        if (true) {
                            if (receiptCheckStatus.status) {
                                profitBundle = `$${(
                                    (Number(cacheMaxGasPricePerFee) / configJson.rateMax -
                                        maxGasSent) *
                                    receiptCheckStatus.gasUsed *
                                    bnbPrice *
                                    10 ** -9
                                ).toFixed(3)}`;
                            } else {
                                profitBundle = `-$${(
                                    maxGasSent *
                                    receiptCheckStatus.gasUsed *
                                    bnbPrice *
                                    10 ** -9
                                ).toFixed(3)}`;
                            }
                        }
                        profitBundle = `\nProfit: ${profitBundle}`;
                        maxGasPiceEnemy = `\nEnemy :${(Number(maxGasPiceEnemy) / 10 ** 9).toFixed(
                            2
                        )} Gwei`;
                        priceList1 = `${maxGasSent} ${priceList1} ${profitBundle} ${maxGasPiceEnemy}`;
                        hashCheckStatus = [];
                        if (receiptCheckStatus.status) {
                            console.log("Success bid!! At block:", receiptCheckStatus.blockNumber);
                        } else {
                            console.log("Fail bid!! At block:", receiptCheckStatus.blockNumber);
                        }
                        timeSendReal = await web3.eth.getBlock(receiptCheckStatus.blockNumber);
                        timeSendReal = timeSendReal.timestamp;
                        console.log("timeStampWrong:", timeSendReal);
                    }
                    if (
                        timeSendReal.toFixed() != (Number(startTime_[0]) + 120).toFixed() &&
                        timeSendReal > 1.7 * 10 ** 9
                    ) {
                        const oldTimeBid = timeSendTx;
                        if (Math.abs(Number(startTime_[0]) + 120 - timeSendReal) < 100) {
                            if (
                                timeSendReal < Number(startTime_[0]) + 120 ||
                                timeSendReal - (Number(startTime_[0]) + 120) > 10
                            ) {
                                // timeSendTx =
                                //     timeSendTx + (Number(startTime_[0]) + 120 - timeSendReal);
                                // console.log("timeSend");
                            } else {
                                // timeSendTx =
                                //     timeSendTx + (Number(startTime_[0]) + 120 - timeSendReal) / 2;
                                // console.log("timeSend / 2");
                            }
                        }
                        const contentTimeBid = `Expect: ${(Number(startTime_[0]) + 120)
                            .toFixed()
                            .slice(8, 10)}\nResult: ${timeSendReal
                            .toFixed()
                            .slice(8, 10)}\nOld: ${oldTimeBid.toFixed(
                            2
                        )}\nNew: ${timeSendTx.toFixed(2)}`;
                        request(
                            "https://api.telegram.org/" +
                                apiTele +
                                "/sendMessage?chat_id=@" +
                                chatId +
                                "&text=" +
                                contentTimeBid,
                            function (error, response, body) {}
                        );
                    }
                } catch (error) {
                    hashCheckStatus = [];
                    console.log(error);
                }
                try {
                    request(
                        "https://api.telegram.org/" +
                            apiTele +
                            "/sendMessage?chat_id=@" +
                            chatId +
                            "&text=" +
                            priceList1,
                        function (error, response, body) {}
                    );
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
            fs.writeFile("waitBid.txt", content, err => {
                if (err) {
                    console.error(err);
                }
            });
            await sleep(1000);
        }
    }
}
const resendTxNewGasPrice = async newGasPriceSend => {
    try {
        if (Number(newGasPriceSend) < 50 * 10 ** 9) {
            if (txResend.gasPrice * 1.1 > newGasPriceSend) {
                txResend.gasPrice = Math.floor(Number(txResend.gasPrice) * 1.3 + 10 ** 8);
            } else {
                txResend.gasPrice = Math.floor(Number(newGasPriceSend) + 10 ** 9);
            }
            var tx = new Tx(txResend, { common: chain });
            tx.sign(privateKey);
            var serializedTx = tx.serialize();
            web3rpc.eth.sendSignedTransaction("0x" + serializedTx.toString("hex")).then(hash => {
                hashCheckStatus.push(hash.receipt.transactionHash);
            });
            console.log("New gasPrice: ", txResend.gasPrice);
        } else {
            console.log("Gas price over 50Gwei");
        }
    } catch (err) {
        console.error(err);
    }
};
async function bid() {
    const Private_Key = process.env.PRIVATE_KEY_BID_MAINNET;
    acc = web3.eth.accounts.privateKeyToAccount(Private_Key);
    console.log(acc.address);
    let hourCache = new Date().getHours() - 4;
    // getPendingTransactions.on("data", txHash => {
    //     setTimeout(async () => {
    //         try {
    //             if (txResend.data && isFrontRun) {
    //                 web3.eth
    //                     .getTransaction(txHash)
    //                     .then(tx => {
    //                         if (tx != null) {
    //                             if (checkEnemy(tx.input)) {
    //                                 // avoid code bid func in smart contract same enemy methodID
    //                                 console.log(tx.hash, tx.gasPrice, tx.from);
    //                                 if (
    //                                     Number(tx.gasPrice) > minGasPrice * 10 ** 9 &&
    //                                     Number(tx.gasPrice) > Number(txResend.gasPrice) &&
    //                                     Number(tx.gasPrice) < Number(maxGasPricePerFee) * 10 ** 9
    //                                 ) {
    //                                     resendTxNewGasPrice(tx.gasPrice);
    //                                 } else {
    //                                     maxGasPiceEnemy = tx.gasPrice;
    //                                     console.log(
    //                                         `Gas price is not in range: ${minGasPrice}Gwei - ${maxGasPricePerFee}Gwei or lower current gas price`
    //                                     );
    //                                 }
    //                             }
    //                         }
    //                     })
    //                     .catch(err => {
    //                         console.error(err);
    //                     });
    //             }
    //         } catch (err) {
    //             console.error("err");
    //         }
    //     });
    // });
    while (true) {
        if (Math.abs(new Date().getHours() - hourCache) >= 4) {
            try {
                bnbPrice = await getBnbPrice();
                hourCache = new Date().getHours();
                request(
                    `https://api.telegram.org/${apiTele}/sendMessage?chat_id=@${chatId}&text=Status: \xF0\x9F\x86\x97\nTime: ${timeSendTx}\nContract: ${contractAddress.slice(
                        0,
                        6
                    )}...${contractAddress.slice(38, 42)}`,
                    function (error, response, body) {}
                );
            } catch (error) {
                console.log("Send status fail");
            }
        }
        await setup(Private_Key);
        await sleep(5000);
    }
}

bid();
