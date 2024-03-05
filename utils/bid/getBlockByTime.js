const Web3 = require("web3");
const web3 = new Web3("https://bsc-dataseed3.bnbchain.org");

const getBlockByTime = async (web3_, time_) => {
    let blockNumber = await web3_.eth.getBlockNumber();
    let block = await web3_.eth.getBlock(blockNumber);
    while (true) {
        if (block.timestamp > time_) {
            block = await web3_.eth.getBlock((blockNumber -= 1));
            console.log(block.timestamp);
            break;
        }
        else if (block.timestamp < time_) {
            block = await web3_.eth.getBlock((blockNumber += 1));
            console.log(block.timestamp);
            break;
        }
        else {
            console.log(block.timestamp);
            break;
        }
    }
    console.log(block.timestamp);
    return block;
};

getBlockByTime(web3, 36700455);
