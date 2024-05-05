const TelegramBot = require("node-telegram-bot-api");
const Web3 = require("web3");
const config = require("../config/config");
require("dotenv").config();
const token = process.env.api_telegram.replace("bot", "");
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/status/, async (msg) => {
    const chatId = msg.chat.id;
    try {
        const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        const blockNumber = await web3.eth.getBlockNumber();
        if (blockNumber > 0) {
            bot.sendMessage(chatId, "Block number: " + blockNumber);
        } else {
            const isSyncing = await web3.eth.isSyncing();
            console.log(isSyncing.toString());
            bot.sendMessage(
                chatId,
                `Syncing:\nstartingBlock: ${isSyncing.startingBlock}\ncurrentBlock: ${isSyncing.currentBlock}\nhighestBlock: ${isSyncing.highestBlock}\nknownStates: ${isSyncing.knownStates}\npulledStates: ${isSyncing.pulledStates}`
            );
        }
    } catch (error) {
        bot.sendMessage(chatId, "Fail connect node");
    }
});
