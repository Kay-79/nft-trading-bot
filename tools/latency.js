const Web3 = require("web3");
const configJson = require("../config/config");
const { exit } = require("process");
const web3a = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed3.bnbchain.org"));
let web3;
try {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
} catch (error) {}
const { sleep } = require("../utils/common/sleep");
const checkLatency = async () => {
    sleep(300);
    try {
        web3a.eth.getBlockNumber().then((latencyPublic) => {
            console.log(`Latency public : ${latencyPublic}`);
        });
        try {
            web3.eth.getBlockNumber().then((latencyPrivate) => {
                console.log(`Latency private: ${latencyPrivate}`);
            });
        } catch (error) {
            console.log("Check on private node failed");
        }
    } catch (error) {
        console.log("Error: ", error);
    }
    if (latencyPublic - latencyPrivate > 10) {
        console.log(`Node is syncing... ${(Date.now() / 1000).toFixed()}`);
    }
    await sleep(2000);
};
checkLatency();
