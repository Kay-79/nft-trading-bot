const shuffleArray = require("../change/shuffleArray");
const prepareBatch = (arrId, arrPrice, amount) => {
    var combinedArray = arrId.map(function (item, index) {
        return [item, arrPrice[index]];
    });
    let arrCommon = [];
    let arrUncommon = [];
    let arrUnique = [];
    for (let index = 0; index < arrId.length; index++) {
        switch (arrId[index][0]) {
            case "1":
                arrCommon.push(arrId[index]);
                break;
            case "2":
                arrUncommon.push(arrId[index]);
                break;
            case "3":
                arrUnique.push(arrId[index]);
                break;
            default:
                break;
        }
    }
    shuffleArray(arrCommon);
    shuffleArray(arrUncommon);
    shuffleArray(arrUnique);
    arrId = arrCommon.concat(arrUncommon, arrUnique);
    var shuffledPrices = arrId.map(function (item) {
        return combinedArray.find(function (element) {
            return element[0] === item;
        })[1];
    });
    //sort array by id amount/all
    let arrIdNew = [];
    let arrPriceNew = [];
    for (let i = 0; i < amount; i++) {
        arrIdNew.push(arrId[i]);
        arrPriceNew.push(shuffledPrices[i]);
    }
    arrIdNew.sort(function (a, b) {
        return a - b;
    });
    arrPriceNew.sort(function (a, b) {
        return a - b;
    });
    return [arrIdNew, arrPriceNew];
};
module.exports = prepareBatch;
// prepareBatch(
//     ["303", "202", "101", "103", "302", "301", "201", "102", "203"],
//     ["303", "202", "101", "103", "302", "301", "201", "102", "203"]
// );
