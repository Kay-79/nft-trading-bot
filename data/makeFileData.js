const { arrayify } = require('ethers/lib/utils');
const fs = require('fs');
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function makeFile() {
    await makeArray()
    await getOldData()
    console.log(arrayID)
    console.log(oldData)
    for (let index = 0; index < arrayID.length; index++) {
        let flag = false
        for (let index1 = 0; index1 < oldData.length; index1++) {
            if (Number(arrayID[index]) == Number(oldData[index1])) {
                arrayID[index] = oldData[index1] + '\n' + oldData[index1 + 1].replace('  ', '') + '\n' + '99999' + '\n'
                flag = true
            }
        }
        if (flag == true) { continue }
        arrayID[index] = arrayID[index] + '\n' + 'No Name' + '\n' + '99999' + '\n'
    }
    fs.writeFile('./data/dataMomo.txt', arrayID.toString().replaceAll(',', ''), err => {
        if (err) {
            console.error(err);
        }
    });
}

async function makeArray() {
    for (let index00 = 1; index00 < 5; index00++) {// common to rare
        for (let index0 = 1; index0 < 5; index0++) {
            '\n\n'
            for (let index = 1; index < 56; index++) {
                let countID = ''
                if (index < 10) {
                    countID = '0' + index.toString()
                }
                else {
                    countID = index.toString()
                }
                let id_ = index00.toString() + index0.toString() + '0' + countID.toString()
                arrayID.push(id_)
            }
        }
    }
    for (let index = 1; index < 185; index++) {
        let countID = ''
        if (index < 10) {
            countID = '5000' + index
        }
        else if (index < 100) {
            countID = '500' + index
        }
        else if (index < 1000) {
            countID = '50' + index
        }
        // countID += '\n'
        arrayID.push(countID)
    }
    for (let index = 1; index < 12; index++) {
        let countID = ''
        if (index < 10) {
            countID = '6000' + index
        }
        else if (index < 100) {
            countID = '600' + index
        }
        else if (index < 1000) {
            countID = '60' + index
        }
        // countID += '\n'
        arrayID.push(countID)
    }
}

async function getOldData() {
    oldData = fs.readFileSync('./data/dataMomo.csv', 'utf8');
    oldData = oldData.split('\n')
    // console.log(oldData)
}
// getOldData()
arrayID = []
makeFile()