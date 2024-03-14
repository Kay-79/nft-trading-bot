const { checkMomosUnlistPrivateNode } = require("../create/checkMomosUnlistPrivateNode");
const updateInventory = async (contractBuys) => {
    for (let i = 0; i < contractBuys.length; i++) {
        console.log(`Update inventory of ${contractBuys[i]}`);
        await checkMomosUnlistPrivateNode(contractBuys[i]);
    }
};
module.exports = { updateInventory };
