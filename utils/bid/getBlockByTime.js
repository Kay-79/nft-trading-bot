// const Web3 = require("web3");
// const web3 = new Web3("https://bsc-dataseed3.bnbchain.org");

const { sleep, ranSleep } = require("../common/sleep");
const getBlockByTime = async (web3_, time_) => {
    let blockNumber = await web3_.eth.getBlockNumber();
    let block = await web3_.eth.getBlock(blockNumber);
    while (true) {
        await sleep(1000);
        const amountBlock = Math.floor(Math.abs(block.timestamp - time_) / 3);
        if (block.timestamp > time_) {
            block = await web3_.eth.getBlock((blockNumber -= amountBlock == 0 ? 1 : amountBlock));
            console.log(block.timestamp);
            // break;
        } else if (block.timestamp < time_) {
            block = await web3_.eth.getBlock((blockNumber += amountBlock == 0 ? 1 : amountBlock));
            console.log(block.timestamp);
            // break;
        } else {
            console.log(block.timestamp);
            break;
        }
        if (Math.abs(block.timestamp - time_) < 3) {
            if (block.timestamp > time_) {
                return block.number - 1;
            } else if (block.timestamp < time_) {
                return block.number + 1;
            }
        }
    }
    console.log(block.number);
    return block.number;
};
module.exports = getBlockByTime;
// time per block ~ 3s
// getBlockByTime(web3, 1709654717);
