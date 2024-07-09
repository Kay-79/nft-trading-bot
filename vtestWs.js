require("dotenv").config();
const configJS = require("./config/config");
var Web3 = require("web3");
var fs = require("fs");
const { exit } = require("process");
var web3 = new Web3(new Web3.providers.WebsocketProvider(configJS.wss.testnet));
const common = require("ethereumjs-common");
const Tx = require("ethereumjs-tx").Transaction;
const chain = common.default.forCustomChain(
    "mainnet",
    {
        name: "bnb",
        networkId: 97,
        chainId: 97
    },
    "petersburg"
);
const getPendingTransactions = web3.eth.subscribe("pendingTransactions", (err, res) => {
    if (err) console.error(err);
});
let txResend = {
    from: "0x1111c16591c4ECe1c313f46A63330D8BCf461111",
    gas: 100000,
    gasPrice: 0, //change with new gas price
    nonce: 929, //change with new nonce
    to: "0x1111c16591c4ECe1c313f46A63330D8BCf461111",
    value: 0,
    data: "0x" //change with new data
};
const resendTxNewGasPrice = async newGasPriceSend => {
    try {
        txResend.gasPrice = Number(
            (Number(newGasPriceSend) + 10 ** 8 + txResend.gasPrice * 0.100001).toFixed()
        );
        const signedNew = await web3.eth.accounts.signTransaction(
            txResend,
            process.env.PRIVATE_KEY_1111
        );
        console.log(signedNew.rawTransaction);
        var privateKey = Buffer.from(process.env.PRIVATE_KEY_1111, "hex");
        var tx = new Tx(txResend, { common: chain });
        tx.sign(privateKey);
        var serializedTx = tx.serialize();
        console.log("0x" + serializedTx.toString("hex"));

        await web3.eth.sendSignedTransaction("0x" + serializedTx.toString("hex"));
        exit();
    } catch (err) {
        1;
        console.error(err);
    }
};
const enemys = [0x06a0f0fa38ae42b7b3c8698e987862afa58e90d9];
const checkEnemy = toAdd => {
    for (let i = 0; i < enemys.length; i++) {
        if (toAdd == enemys[i]) return true;
    }
    return false;
};
let flag = false;
var main = async function () {
    getPendingTransactions.on("data", txHash => {
        setTimeout(async () => {
            try {
                let tx = await web3.eth.getTransaction(txHash);
                if (tx != null)
                    if (checkEnemy(tx.to)) {
                        if (
                            Number(tx.gasPrice) > Number(txResend.gasPrice) &&
                            Number(tx.gasPrice) < 10 * 10 ** 9 &&
                            flag == false
                        ) {
                            console.log(tx.hash, tx.gasPrice);
                            txResend.data = tx.hash;
                            txResend.gasPrice = Number((Number(tx.gasPrice) + 10 ** 8).toFixed());
                            console.log(txResend);
                            await resendTxNewGasPrice(tx.gasPrice);
                            flag = true;
                        }
                    }
            } catch (err) {
                console.error(err);
            }
        });
    });
    setTimeout(() => {
        getPendingTransactions.unsubscribe(function (error, success) {
            if (success) console.log("Successfully clearSubscriptions!");
        });
        console.log("Done");
    }, 6000);
};

main();

async function getReceipt(hash) {
    var receipt = web3.eth.getTransactionReceipt(hash);
    console.log({ rec: await receipt });
}
