const { checkMomosUnlistPrivateNode } = require("../create/checkMomosUnlistPrivateNode");
const config = require("../../config/config");
const updateInventory = async contractBuys => {
    for (let i = 0; i < contractBuys.length; i++) {
        if (contractBuys[i] === config.changer || contractBuys[i] === config.bidder) {
            console.log(`Skip ${contractBuys[i]}`);
            continue;
        }
        console.log(`Update inventory of ${contractBuys[i]}`);
        await checkMomosUnlistPrivateNode(contractBuys[i], true);
    }
};
// module.exports = { updateInventory };
