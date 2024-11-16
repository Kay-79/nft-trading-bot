const checkRightAccBuy = (arrayMyAcc, accRunRight) => {
    for (let index = 0; index < arrayMyAcc.length; index++) {
        if (accRunRight == arrayMyAcc[index][0]) {
            return true;
        }
    }
    return false;
};
module.exports = checkRightAccBuy;
