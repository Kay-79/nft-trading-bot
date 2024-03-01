require("dotenv").config();
const configJS = require("./config/config");
var Web3 = require("web3");
var fs = require("fs");
const { exit } = require("process");
// You can use any websocket provider such as infura, alchemy etc.
// It will look like: 'wss://mainnet.infura.io/ws/v3/<API_KEY>'
var web3 = new Web3(new Web3.providers.WebsocketProvider(configJS.wss.testnet));
const common = require("ethereumjs-common");

const chain = common.default.forCustomChain(
    "mainnet",
    {
        name: "bnb",
        networkId: 97,
        chainId: 97,
    },
    "petersburg"
);
// var web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-testnet.publicnode.com"));

// Get pending transactions from ethereum network (mempool)
const getPendingTransactions = web3.eth.subscribe("pendingTransactions", (err, res) => {
    if (err) console.error(err);
});
// console.log(getPendingTransactions, "1");
// exit();
let txResend = {
    from: "0x4639d35985751E9265a62e50A348d5E4C0A9d212",
    gas: 100000,
    gasPrice: 0, //change with new gas price
    nonce: 7, //change with new nonce
    to: "0x4639d35985751E9265a62e50A348d5E4C0A9d212",
    value: 0,
    data: "0x", //change with new data
    // chainId: 97,
    // networkId: 97,
};
const resendTxNewGasPrice = async (newGasPriceSend) => {
    try {
        txResend.gasPrice = Number(
            (Number(newGasPriceSend) + 10 ** 8 + txResend.gasPrice * 0.100001).toFixed()
        );
        // console.log(txResend);
        // const signedNew = await web3.eth.accounts.signTransaction(
        //     txResend,
        //     process.env.PRIVATE_KEY_BID
        // );
        // web3.eth.sendSignedTransaction(signedNew.rawTransaction);
        const Tx = require("ethereumjs-tx").Transaction;
        var privateKey = Buffer.from(process.env.PRIVATE_KEY_1111, "hex");

        var rawTx = txResend;

        var tx = new Tx(rawTx, { common: chain });
        tx.sign(privateKey);

        var serializedTx = tx.serialize();
        console.log(tx);
        console.log(tx.raw.toString("hex"));
        await web3.eth.sendSignedTransaction("0x" + serializedTx.toString("hex"));
        exit();
    } catch (err) {
        1;
        console.error(err);
    }
};
const enemys = [0x06a0f0fa38ae42b7b3c8698e987862afa58e90d9];
const checkEnemy = (toAdd) => {
    for (let i = 0; i < enemys.length; i++) {
        if (toAdd == enemys[i]) return true;
    }
    return false;
};
let flag = false;
var main = async function () {
    // const startTime = Date.now();
    // for (let i = 0; i < 100; i++) {
    //     signed = await web3.eth.accounts.signTransaction(txResend, process.env.PRIVATE_KEY_BID);
    // }
    // console.log("Time: ", Date.now() - startTime);
    // exit();
    getPendingTransactions.on("data", (txHash) => {
        setTimeout(async () => {
            try {
                let tx = await web3.eth.getTransaction(txHash);
                if (tx != null)
                    if (checkEnemy(tx.to)) {
                        // console.log(tx.hash, tx.gasPrice);
                        // console.log(tx.hash, tx.gasPrice, tx.from);
                        if (
                            Number(tx.gasPrice) > Number(txResend.gasPrice) &&
                            Number(tx.gasPrice) < 10 * 10 ** 9 &&
                            flag == false
                        ) {
                            console.log(tx.hash, tx.gasPrice);
                            txResend.data = tx.hash;
                            txResend.gasPrice = Number((Number(tx.gasPrice) + 10 ** 8).toFixed());
                            // txResend.nonce = await web3.eth.getTransactionCount(
                            //     "0x1111c16591c4ECe1c313f46A63330D8BCf461111"
                            // );
                            console.log(txResend);
                            // const signedNew = await web3.eth.accounts.signTransaction(
                            //     txResend,
                            //     process.env.PRIVATE_KEY_1111
                            // );
                            // web3.eth.sendSignedTransaction(signedNew.rawTransaction);
                            await resendTxNewGasPrice(tx.gasPrice);
                            flag = true;
                            // exit();
                        }
                    }
            } catch (err) {
                console.error(err);
            }
        });
    });
    // console.log(getPendingTransactions, "2");
    setTimeout(() => {
        getPendingTransactions.unsubscribe(function (error, success) {
            if (success) console.log("Successfully clearSubscriptions!");
        });
        // console.log(getPendingTransactions, "3");
        console.log("Done");
    }, 6000);
};

main();

/// Get transaction details from transaction receipt
async function getReceipt(hash) {
    var receipt = web3.eth.getTransactionReceipt(hash);
    console.log({ rec: await receipt });
}

// getReceipt("0xdb4dd756220ad7677e2238d6cec303d19e93de1671cdd1828a94458a5235b1a6")
// .then(() => process.exit(0))
// .catch((error) => {
// console.error(error);
// process.exit (first)
// })
