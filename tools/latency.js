const Web3 = require("web3");
const configJson = require("../config/config");
const { exit } = require("process");
const web3a = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed3.bnbchain.org"));
try {
    const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
} catch (error) {}
const { sleep } = require("../utils/common/sleep");
const checkLatency = async () => {
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
    await sleep(3000);
    exit(0);
};
checkLatency();
