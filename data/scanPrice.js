const axios = require("axios");
const fs = require("fs");

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

async function scanPrice() {
    dataMomo = fs.readFileSync("data/dataMomo.txt", "utf8");
    dataMomo = dataMomo.split("\n");
    for (let index = 0; index < dataMomo.length; index += 3) {
        idMomo.push(dataMomo[index]);
        nameMomo.push(dataMomo[index + 1]);
        priceMomo.push(dataMomo[index + 2]);
    }
    let countTen = 0;
    let flagSave = false;
    for (let index = 0; index < idMomo.length; index++) {
        if (Number(idMomo[index] >= 40000) && checkPro == false) {
            break;
        }
        try {
            await sleep(500 + 500 * Math.random());
            let dataMin = await axios
                .get(
                    "https://nftapi.mobox.io/auction/search/BNB?page=1&limit=10&category=&vType=&sort=price&pType=" +
                        idMomo[index]
                )
                .catch(e => {
                    console.log("Err get min price!!");
                });
            countTen += 1;
            if (!dataMin) {
                index -= 1;
                await sleep(Number((Math.random() * 100000).toFixed()));
                continue;
            }
            console.log(idMomo[index], ((index / idMomo.length) * 100).toFixed(2) + "%");
            dataMin = dataMin.data.list;
            if (dataMin == 0) {
                console.log("Not on MP!!");
                await sleep(Number((Math.random() * 10000).toFixed()));
                continue;
            }
            let amountMomoScaned = dataMin.length;
            let price_scan = [];
            let time_scan = [];
            for (let index1 = 0; index1 < amountMomoScaned; index1++) {
                price_scan.push((Number(dataMin[index1].nowPrice) / 10 ** 9).toFixed(2));
                time_scan.push(Number(dataMin[index1].uptime));
                if (Date.now() / 1000 - time_scan[index1] > timeWait) {
                    //15 * 60 is 15 mins
                    if (price_scan[index1] < Number(priceMomo[index])) {
                        console.log(
                            index1 + 1,
                            "Change " + priceMomo[index] + " to",
                            price_scan[index1]
                        );
                        priceMomo[index] = price_scan[index1];
                        flagSave = true;
                    }
                    break;
                }
            }
        } catch (error) {
            console.log("Err during get minPrice!");
            console.log(error);
        }
        if (countTen >= 30) {
            if (flagSave == false) {
                console.log("Not save");
                countTen = 0;
                continue;
            }
            flagSave = false;
            console.log("Saving");
            countTen = 0;
            for (let index = 0; index < idMomo.length; index++) {
                if (Number(idMomo[index]) > 0) {
                    arrayID.push(
                        idMomo[index] + "\n" + nameMomo[index] + "\n" + priceMomo[index] + "\n"
                    );
                }
            }
            fs.writeFile("./data/dataMomo.txt", arrayID.toString().replaceAll(",", ""), err => {
                if (err) {
                    console.error(err);
                }
            });
            await sleep(2000);
            dataMomo = fs.readFileSync("data/dataMomo.txt", "utf8");
            dataMomo = dataMomo.split("\n");
            idMomo = [];
            nameMomo = [];
            priceMomo = [];
            arrayID = [];
            for (let index = 0; index < dataMomo.length; index += 3) {
                idMomo.push(dataMomo[index]);
                nameMomo.push(dataMomo[index + 1]);
                priceMomo.push(dataMomo[index + 2]);
            }
        }
    }
    for (let index = 0; index < idMomo.length; index++) {
        if (Number(idMomo[index]) > 0) {
            arrayID.push(idMomo[index] + "\n" + nameMomo[index] + "\n" + priceMomo[index] + "\n");
        }
    }
    fs.writeFile("./data/dataMomo.txt", arrayID.toString().replaceAll(",", ""), err => {
        if (err) {
            console.error(err);
        }
    });
    console.log("Done !!!");
}
const timeWait = 30 * 60; //30mins
idMomo = [];
nameMomo = [];
priceMomo = [];
arrayID = [];
checkPro = false;

scanPrice();
