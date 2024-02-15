require("dotenv").config();
const configJS = require("./config/config");
var Web3 = require("web3");
var fs = require("fs");

var options = {
    timeout: 3000,
    clientConfig: {
        // keepalive: true,
        // keepaliveInterval: 6000,
        maxReceivedFrameSize: 100000000,
        maxReceivedMessageSize: 100000000,
    },
    reconnect: {
        auto: false,
        delay: 5000,
        maxAttempts: 15,
        onTimeout: true,
    },
};
// You can use any websocket provider such as infura, alchemy etc.
// It will look like: 'wss://mainnet.infura.io/ws/v3/<API_KEY>'
var web3 = new Web3(new Web3.providers.WebsocketProvider(configJS.wss.private, options));

// Get pending transactions from ethereum network (mempool)
const getPendingTransactions = web3.eth.subscribe("pendingTransactions", (err, res) => {
    if (err) console.error(err);
});
const enemys = [
    0x13f4ea83d0bd40e75c8222255bc855a974568dd4,
    0x55d398326f99059ff775485246999027b3197955,
];
const checkEnemy = (toAdd)=>{
    for (let i = 0; i < enemys.length; i++) {
        if (toAdd == enemys[i]) return true
    }
    return false
}
var main = function () {
    getPendingTransactions.on("data", (txHash) => {
        setTimeout(async () => {
            try {
                let tx = await web3.eth.getTransaction(txHash);
                if (tx != null) if (checkEnemy(tx.to)) console.log(tx.hash);
                // Get Transaction from a certain address and write it down in a file
                var writeTxFromTether = async function (data) {
                    fs.appendFile("./Transactions.txt", JSON.stringify(data) + " n", (err) => {
                        if (err) console.log(err);
                        console.log("Updated Successfully");
                    });
                };
                // console.log({ tx });
            } catch (err) {
                console.error('err');
            }
        });
    });
    setTimeout(() => {
        getPendingTransactions.unsubscribe(function (error, success) {
            if (success) console.log("Successfully unsubscribed!");
        });
    }, 4000);
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
