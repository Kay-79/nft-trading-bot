const Web3 = require("web3");
const configJson = require("../config/config");
const { exit } = require("process");
const web3a = new Web3(new Web3.providers.HttpProvider(configJson.rpcs.bid));
const checkLatency = async () => {
    try {
        const latency2 = await web3a.eth.getBlockNumber();
        console.log(`Latency public: ${latency2}`);
        try {
            const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
            const latency = await web3.eth.getBlockNumber();
            console.log(`Latency private: ${latency}`);
        } catch (error) {
            console.log("Check on private node failed");
        }
    } catch (error) {
        console.log("Error: ", error);
    }
    exit(0);
};
checkLatency();
