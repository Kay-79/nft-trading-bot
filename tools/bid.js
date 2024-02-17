require("dotenv").config();
const request = require("request");
const fs = require("fs");
const checkAvailable = require("../utils/bid/checkAvailable");
const configJson = require("../config/config");
const { sleep, ranSleep } = require("../utils/common/sleep");
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.WebsocketProvider(configJson.wss.private));
const { exit } = require("process");
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Promise Rejection:", err);
});
const apiTele = process.env.api_telegram;
const chatId = process.env.chatId_mobox;
const abi = JSON.parse(fs.readFileSync("./abi/abiMobox.json"));
const contractAddress = configJson.accBuy;
const contract = new web3.eth.Contract(abi, contractAddress);
const overTime = 180;
const timeGetAvaliableAuction = 5;
let timeSendTx = configJson.timeBid;
const emoji = configJson.emojiURL;
const getPendingTransactions = web3.eth.subscribe("pendingTransactions", (err, res) => {
    if (err) console.error(err);
});
let txResend = {
    from: configJson.bidder,
    gas: 1000000,
    gasPrice: 0, //change with new gas price
    nonce: 0, //change with new nonce
    to: contractAddress,
    value: 0,
    data: "newData", //change with new data
};
let checkHashEach = "";
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
        const startTime_ = dataBid[3].split(",");
        const index_ = dataBid[2].split(",");
        if (index_[0] != "" && Date.now() / 1000 > Number(startTime_[0]) + timeSendTx - 15) {
            const seller_ = dataBid[0].split(",");
            const priceList = dataBid[1].split(",");
            const amountList = dataBid[5].split(",");
            const idList = dataBid[4].split(",");
            const gasPriceScanRaw = dataBid[6].split(",");
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
                            data: contract.methods
                                .bid(
                                    seller_[index].toString(),
                                    index_[index].toString(),
                                    startTime_[index].toString(),
                                    priceList[index].toString(),
                                    "1"
                                )
                                .encodeABI(), // amount = 1
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
                                priceList.toString(),
                                amountBid.toString()
                            )
                            .encodeABI(), // amount = 1 or > 1
                    });
                    txResend.gasPrice = gasPriceScan[0];
                    txResend.nonce = nonce_;
                    txResend.data = contract.methods
                        .bid(
                            seller_.toString(),
                            index_.toString(),
                            startTime_.toString(),
                            priceList.toString(),
                            amountBid.toString()
                        )
                        .encodeABI();
                }
                let checkSuccess = emoji.success;
                let isAvailableAuctions = true;
                try {
                    let signed = [];
                    let biding = [];
                    for (let index = 0; index < tx.length; index++) {
                        signed.push(
                            await web3.eth.accounts.signTransaction(tx[index], Private_Key_)
                        );
                    }
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
                            console.log(
                                "Sleep:" +
                                    (
                                        Number(startTime_[0]) +
                                        timeSendTx -
                                        Date.now() / 1000
                                    ).toFixed(3)
                            );
                            await sleep(Number(startTime_[0]) + timeSendTx - Date.now() / 1000);
                        }
                    } else {
                        isAvailableAuctions = await checkAvailable(
                            seller_[0],
                            index_[0],
                            startTime_[0]
                        );
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
                                checkSuccess = emoji.success;
                                const sendEach = web3.eth.sendSignedTransaction(
                                    signed[index].rawTransaction
                                );
                                getPendingTransactions.on("data", (txHash) => {
                                    setTimeout(async () => {
                                        try {
                                            let tx = await web3.eth.getTransaction(txHash);
                                            if (tx != null)
                                                if (checkEnemy(tx.to)) {
                                                    console.log(tx.hash, tx.gasPrice, tx.from);
                                                    if (
                                                        Number(tx.gasPrice) >
                                                            Number(txResend.gasPrice) &&
                                                        Number(txResend.gasPrice) < 15 * 10 ** 9
                                                    ) {
                                                        resendTxNewGasPrice(tx.gasPrice);
                                                    }
                                                }
                                        } catch (err) {
                                            console.error("err");
                                        }
                                    });
                                });
                                setTimeout(() => {
                                    getPendingTransactions.unsubscribe(function (error, success) {
                                        if (success) console.log("Successfully unsubscribed!");
                                    });
                                }, 4000);
                                await sleep(6000);
                                // console.log("Successful bid! At block:", sendEach.blockNumber);
                            } catch (error) {
                                console.log("Fail...setting new time");
                                checkSuccess = emoji.fail;
                            }
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
                    checkSuccess = emoji.fail;
                }
                await sleep(1000);
                for (let op = 0; op < idList.length; op++) {
                    idList[op] = idList[op].slice(0, 1);
                }
                try {
                    let price_send = [];
                    for (let q = 0; q < priceList.length; q++) {
                        price_send.push(
                            " " + ((Number(priceList[q]) - 10 ** 14) / 10 ** 18).toFixed(2)
                        );
                    }
                    priceList1 =
                        // checkSuccess +
                        " " +
                        gasPriceScanRaw +
                        "\nPrices   : " +
                        price_send.toString().replace(" ", "") +
                        "\nAmount: " +
                        amountList +
                        "\nID List   : " +
                        idList;
                    if (!isAvailableAuctions) {
                        priceList1 = `Auction be canceled by ${seller_[0]}`;
                        checkHashEach = "";
                        console.log(priceList1);
                    }
                } catch (error) {}
                try {
                    if (checkHashEach) {
                        await sleep(1000); //sleep to avoid pending hash
                        const receiptCheckStatus = await web3.eth.getTransactionReceipt(
                            checkHashEach
                        );
                        if (receiptCheckStatus.status) {
                            priceList1 = emoji.success + priceList1;
                        } else {
                            priceList1 = emoji.fail + priceList1;
                        }
                        timeSendReal = await web3.eth.getBlock(receiptCheckStatus.blockNumber);
                        timeSendReal = timeSendReal.timestamp;
                        console.log("timeStampFail:", timeSendReal);
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
                                timeSendTx =
                                    timeSendTx + (Number(startTime_[0]) + 120 - timeSendReal);
                                console.log("timeSend");
                            } else {
                                timeSendTx =
                                    timeSendTx + (Number(startTime_[0]) + 120 - timeSendReal) / 2;
                                console.log("timeSend / 2");
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
            fs.writeFile("waitBid.txt", content, (err) => {
                if (err) {
                    console.error(err);
                }
            });
            await sleep(1000);
        }
    }
}
const enemys = [
    0xcb0cffc2b12739d4be791b8af7fbf49bc1d6a8c2, 0x946398fb54a90d3512e9be5f5f66456f2f760215,
    0x06e8e9e60eba78495f166d73333a10fa49b23f8c, 0x914ddecd7238a2b2858808c227969f74eb276288,
    0x8ac62c00be7bb8d1cc2ea1f9d62daf51129e916f,
];
const checkEnemy = (toAdd) => {
    for (let i = 0; i < enemys.length; i++) {
        if (toAdd == enemys[i]) return true;
    }
    return false;
};
const resendTxNewGasPrice = async (newGasPriceSend) => {
    try {
        txResend.gasPrice = Number((Number(newGasPriceSend) + 10 ** 8).toFixed());
        const signedNew = await web3.eth.accounts.signTransaction(
            txResend,
            process.env.PRIVATE_KEY_BID
        );
        web3.eth.sendSignedTransaction(signedNew.rawTransaction);
        checkHashEach = signedNew.transactionHash;
    } catch (err) {
        console.error(err);
    }
};
async function bid() {
    const Private_Key = process.env.PRIVATE_KEY_BID;
    acc = web3.eth.accounts.privateKeyToAccount(Private_Key);
    console.log(acc.address);
    let hourCache = new Date().getHours() - 4;
    while (true) {
        if (Math.abs(new Date().getHours() - hourCache) >= 4) {
            try {
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
        await sleep(100);
    }
}

bid();
