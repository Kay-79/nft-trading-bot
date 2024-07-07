const TelegramBot = require("node-telegram-bot-api");
const Web3 = require("web3");
const config = require("../config/config");
require("dotenv").config();
const token = process.env.api_telegram.replace("bot", "");
const bot = new TelegramBot(token, {
    polling: {
        interval: 1000,
        autoStart: true,
        params: {
            timeout: 10,
        },
    },
});

bot.on("polling_error", (error) => {
    console.error("Polling error:", error);
});

bot.on("webhook_error", (error) => {
    console.error("Webhook error:", error);
});

bot.onText(/\/status/, async (msg) => {
    const chatId = msg.chat.id;
    try {
        const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        const blockNumber = await web3.eth.getBlockNumber();
        const amountPeer = await web3.eth.net.getPeerCount();
        if (blockNumber > 0) {
            bot.sendMessage(
                chatId,
                "Block number: " + blockNumber + "\nAmount peer: " + amountPeer
            );
        } else {
            const isSyncing = await web3.eth.isSyncing();
            const amountPeer = await web3.eth.net.getPeerCount();
            bot.sendMessage(
                chatId,
                `Syncing:\nstartingBlock: ${isSyncing.startingBlock}\ncurrentBlock: ${isSyncing.currentBlock}\nhighestBlock: ${isSyncing.highestBlock}\nAmount peer: ${amountPeer}`
            );
        }
    } catch (error) {
        bot.sendMessage(chatId, "Fail connect node");
    }
});
