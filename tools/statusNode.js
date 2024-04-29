const Web3 = require("web3");
const { exit } = require("process");
const configJson = require("../config/config");
const apiTele = process.env.api_telegram;
const chatId = process.env.chatId_mobox;
const request = require("request");
let web3;
try {
    web3 = new Web3(new Web3.providers.HttpProvider(configJson.rpcs.public));
} catch (error) {}
const { sleep } = require("../utils/common/sleep");
const statusNode = async () => {
    let nowBLock = await web3.eth.getBlockNumber();
    // send notic
    request(
        `https://api.telegram.org/"${apiTele}/sendMessage?chat_id=@${chatId}&text=${nowBLock}`,
        function (error, response, body) {
            console.log(err);
        }
    );
    exit();
    await sleep(60000);
    while (true) {
        try {
            web3 = new Web3(new Web3.providers.HttpProvider(configJson.rpcs.public));
            let newBLock = await web3.eth.getBlockNumber();
            if (newBLock > nowBLock) {
                nowBLock = newBLock;
            }
        } catch (error) {}
        await sleep(60000);
    }
};
statusNode();
