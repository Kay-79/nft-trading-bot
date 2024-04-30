const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.WebsocketProvider(configJson.wss.private));
const getPendingTransactions = web3.eth.subscribe("pendingTransactions", (err, res) => {
    if (err) console.error(err);
});
const testWss = async () => {
    getPendingTransactions.on("data", (txHash) => {
        setTimeout(async () => {
            try {
                console.log(txHash);
            } catch (err) {
                console.error(err);
            }
        });
    });
};
testWss();
