const fs = require('fs');
const { exit } = require('process');

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
async function sendTxt(gasPrice_, gasLimit_, index_, ids_, prices_, hexData_,) {
    try {
        const inputdata = fs.readFileSync('myAccount_1_0_1.txt', 'utf8');
        myAccount = inputdata.split('\n')
        // console.log(myAccount[1])
    } catch (err) {
        console.error(err);
    }
    const Private_Key = myAccount[1]
    const Web3 = require('web3');
    const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed4.binance.org"));
    acc = web3.eth.accounts.privateKeyToAccount(Private_Key)
    console.log(acc.address)
    const abi = require('./abiMobox.json');
    const contract = new web3.eth.Contract(abi, consractAddress);
    // console.log(contract)
    emptyVar = []
    // console.log(ids,prices)
    // asd
    tx = ''
    encoded = ''
    signArray = ''
    if (hexData_.length == 0) {
        encoded = contract.methods.createAuctionBatch(index_, emptyVar, emptyVar, ids_, prices_).encodeABI();
    } else { encoded = hexData_ }
    tx = {
        from: acc.address,
        gas: gasLimit_,
        gasPrice: gasPrice_ * 10 ** 9,// + i * 10 ** 6,
        to: consractAddress,
        value: 0,
        data: encoded
    }
    await web3.eth.accounts.signTransaction(tx, Private_Key).then(signed => {
        signArray = signed
        // console.log(Date());
    })
    console.log("Listing")
    try {
        let createAuctionBatch = await web3.eth.sendSignedTransaction(signArray.rawTransaction)
        console.log('Done at block:', createAuctionBatch.blockNumber)
        boolSell = "TRUE"
    } catch (error) {
        console.log('Over time or fail during list!')
        exit()
    }
}

async function createBatch(gasPrice_, gasLimit_, hexData_,) {
    let count = 0
    while (true) {
        if (indexs.length != ids.length || indexs.length != prices.length) {
            console.log('Length array not same!')
            break
        }
        if (hexData_.length > 0) {
            await sendTxt(gasPrice_, gasLimit_, '', '', '', hexData_,)
            break
        }
        for (let index = 0; index < indexs.length; index++) {
            if (indexs[index] != undefined) {
                boolSell = "FALSE"
                console.log(indexs[index], ids[index], prices[index])
                await sendTxt(gasPrice_, gasLimit_, indexs[index], ids[index], prices[index], '',)
                if (boolSell == "TRUE") {
                    indexs[index] = undefined
                    count += 1
                }
            }
            await sleep(5000)
        }
        if (count >= indexs.length) {
            console.log("Done")
            break
        }
        await sleep(5000)
    }
}

indexs = [
    0,
]
ids =
    [["11046", "13026"]]
prices =
    [["3.6", "4.7"]]

console.log(indexs.length, ids.length, prices.length)
for (let ii = 0; ii < prices.length; ii++) {
    for (let jj = 0; jj < prices[ii].length; jj++) {
        prices[ii][jj] = ((Math.round((Number(prices[ii][jj])) * 10 ** 5)).toString() + '0000000000000')
    }
}
const consractAddress = ('0x90576D978C8cDB0928F963f5E7080B8BcCaA94B0')
createBatch(3.001, 1000000, '')