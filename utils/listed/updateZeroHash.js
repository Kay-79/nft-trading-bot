const { checkZeroHashPrivateNode } = require("../listed/checkZeroHashPrivateNode");
const config = require("../../config/config");
const updateInventory = async contractBuys => {
    for (let i = 0; i < contractBuys.length; i++) {
        if (contractBuys[i] === config.changer || contractBuys[i] === config.bidder) {
            console.log(`Skip ${contractBuys[i]}`);
            continue;
        }
        console.log(`Update zero hash block inventory of ${contractBuys[i]}`);
        await checkZeroHashPrivateNode(contractBuys[i], true);
    }
};
module.exports = { updateInventory };
