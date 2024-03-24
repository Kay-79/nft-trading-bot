const { sleep } = require("../common/sleep");
const getBlockByTime = async (web3_, time_) => {
    let blockNumber = await web3_.eth.getBlockNumber();
    let block = await web3_.eth.getBlock(blockNumber);
    while (true) {
        for (let i = 0; i < 3; i++) {
            await sleep(1000);
            const amountBlock = Math.floor(Math.abs(block.timestamp - time_) / 3);
            if (block.timestamp > time_) {
                blockNumber -= amountBlock == 0 ? 1 : amountBlock;
                block = await web3_.eth.getBlock(blockNumber);
                console.log(block.timestamp, typeof block.timestamp);
            } else if (block.timestamp < time_) {
                blockNumber += amountBlock == 0 ? 1 : amountBlock;
                block = await web3_.eth.getBlock(blockNumber);
                console.log(block.timestamp);
            } else {
                console.log(block.timestamp);
                console.log(block.number, 11);
                return block.number;
            }
        }
        if (Math.abs(block.timestamp - time_) <= 1.5) {
            if (block.timestamp > time_) {
                console.log(block.number - 1, 22);
                return block.number - 1;
            } else if (block.timestamp < time_) {
                console.log(block.number + 1, 33);
                return block.number + 1;
            }
        }
    }
};
module.exports = getBlockByTime;

// Test
// const Web3 = require("web3");
// const web3 = new Web3("https://bsc-dataseed3.bnbchain.org");
// getBlockByTime(web3, "1711253261");
