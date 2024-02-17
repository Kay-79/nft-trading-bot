require("dotenv").config();
const configJS = require("./config/config");
var Web3 = require("web3");
var fs = require("fs");
const { exit } = require("process");
// You can use any websocket provider such as infura, alchemy etc.
// It will look like: 'wss://mainnet.infura.io/ws/v3/<API_KEY>'
// var web3 = new Web3(new Web3.providers.WebsocketProvider(configJS.wss.private));
var web3 = new Web3(new Web3.providers.WebsocketProvider(configJS.wss.testnet));

// Get pending transactions from ethereum network (mempool)
const getPendingTransactions = web3.eth.subscribe("pendingTransactions", (err, res) => {
    if (err) console.error(err);
});
let txResend = {
    from: "0x1111c16591c4ECe1c313f46A63330D8BCf461111",
    gas: 100000,
    gasPrice: 0, //change with new gas price
    nonce: 898, //change with new nonce
    to: "0x1111c16591c4ECe1c313f46A63330D8BCf461111",
    value: 0,
    data: "0x", //change with new data
};
const resendTxNewGasPrice = async (newGasPriceSend) => {
    try {
        txResend.gasPrice = Number((Number(newGasPriceSend) + 10 ** 8).toFixed());
        console.log(txResend);
        const signedNew = await web3.eth.accounts.signTransaction(
            txResend,
            process.env.PRIVATE_KEY_1111
        );
        await web3.eth.sendSignedTransaction(signedNew.rawTransaction);
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
var main = function () {
    getPendingTransactions.on("data", (txHash) => {
        setTimeout(async () => {
            try {
                let tx = await web3.eth.getTransaction(txHash);
                if (tx != null)
                    if (checkEnemy(tx.to)) {
                        console.log(tx.hash, tx.gasPrice);
                        console.log(tx.hash, tx.gasPrice, tx.from);
                        if (
                            Number(tx.gasPrice) > Number(txResend.gasPrice) &&
                            Number(txResend.gasPrice) < 15 * 10 ** 9
                        ) {
                            txResend.data = tx.hash;
                            await resendTxNewGasPrice(tx.gasPrice);
                            exit();
                        }
                    }
            } catch (err) {
                console.error(err);
            }
        });
    });
    setTimeout(() => {
        getPendingTransactions.unsubscribe(function (error, success) {
            if (success) console.log("Successfully unsubscribed!");
        });
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
