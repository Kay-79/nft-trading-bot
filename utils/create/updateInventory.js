const { checkMomosUnlistPrivateNode } = require("../create/checkMomosUnlistPrivateNode");
const config = require("../../config/config");
const updateInventory = async (contractBuys) => {
    for (let i = 0; i < contractBuys.length; i++) {
        console.log(`Update inventory of ${contractBuys[i]}`);
        if (contractBuys[i] === config.changer || contractBuys[i] === config.bidder) {
            continue;
        }
        await checkMomosUnlistPrivateNode(contractBuys[i], true);
    }
};
module.exports = { updateInventory };
