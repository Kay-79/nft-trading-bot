const shuffleArray = require("../change/shuffleArray");
const prepareBatch = (arrId, arrPrice) => {
    var combinedArray = arrId.map(function (item, index) {
        return [item, arrPrice[index]];
    });

    // // Xáo trộn mảng item
    // arrId.sort(function () {
    //     return 0.5 - Math.random();
    // });
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
    // Lấy lại mảng giá dựa trên sự thay đổi của mảng item
    var shuffledPrices = arrId.map(function (item) {
        return combinedArray.find(function (element) {
            return element[0] === item;
        })[1];
    });

    // console.log("Mả", arrId);
    // console.log("Mảng giá tương ứng:", shuffledPrices);
    return [arrId, shuffledPrices];
};
module.exports = prepareBatch;
// prepareBatch(
//     ["303", "202", "101", "103", "302", "301", "201", "102", "203"],
//     ["303", "202", "101", "103", "302", "301", "201", "102", "203"]
// );
