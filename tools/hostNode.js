const TelegramBot = require("node-telegram-bot-api");
const Web3 = require("web3");
const config = require("../config/config");
require("dotenv").config();
// Thay thế YOUR_TELEGRAM_BOT_TOKEN bằng mã thông báo (token) của bot của bạn
const token = process.env.api_telegram_bot;

// Tạo một bot
const bot = new TelegramBot(token, { polling: true });

// Xử lý lệnh /start
bot.onText(/\/status/, async (msg) => {
    const chatId = msg.chat.id;
    try {
        // const web3 = new Web3(
        //     new Web3.providers.HttpProvider("https://bsc-dataseed3.bnbchain.org")
        // );
        // // get block
        // const blockNumber = await web3.eth.getBlockNumber();
        // bot.sendMessage(chatId, "Block number: " + blockNumber);
        const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        const isSyncing = await web3.eth.isSyncing();
        // isSyncing = {startingBlock: 100, currentBlock: 312, highestBlock: 512, knownStates: 234566, pulledStates: 123455}
        bot.sendMessage(chatId, "Syncing: " + isSyncing);
    } catch (error) {
        bot.sendMessage(chatId, "Fail connect node");
    }
});
