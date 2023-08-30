const request = require('request');
const fs = require('fs');
const configJson = JSON.parse(fs.readFileSync('./config/config.json'));
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
const Web3 = require('web3');
const { exit } = require('process');
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
});
// const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-testnet.publicnode.com"));
const web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.ankr.com/bsc"));
// const web3sc = new Web3(new Web3.providers.WebsocketProvider('wss://solemn-wild-aura.bsc.discover.quiknode.pro/9fbdf28f69f47aa85c76222be804b4224c2dbd22/'));
const apiTele = configJson.api.telegram
const chatId = configJson.chatId.mobox
const abi = JSON.parse(fs.readFileSync('./config/abiMobox.json'));
const contractAddress = configJson.accBuy
const contract = new web3.eth.Contract(abi, contractAddress);
// console.log(acc)
async function init(Private_Key_) {
    inputdata = 'Nonce'
    Bid = false
    try {
        const inputdata = fs.readFileSync('waitBid.txt', 'utf8');
        dataBid = inputdata.split('\n')
        if (inputdata.length > 40) {
            Bid = true
            for (let index = dataBid.length - 1; index >= 0; index--) {// bug here -> fixed -> testing
                if (dataBid[index] == '\r' || dataBid[index] == '') { dataBid.splice(index, 1) }
            }
        }
    } catch (err) { }
    if (Bid == true) {
        const startTime_ = dataBid[3].split(',')
        const index_ = dataBid[2].split(',')
        if (index_[0] != '' && (Date.now() / 1000 > Number(startTime_[0]) + (timeWait - timeGetNonce))) {
            const seller_ = dataBid[0].split(',')
            const priceList = dataBid[1].split(',')
            const amountList = dataBid[5].split(',')
            const idList = dataBid[4].split(',')
            const gasPriceScanRaw = dataBid[6].split(',')
            // const gasPriceScan = Number((Number(dataBid[6].split(',')) * 10 ** 9).toFixed())
            var gasPriceScan = []
            for (let index = 0; index < gasPriceScanRaw.length; index++) {
                gasPriceScan[index] = Number((Number(gasPriceScanRaw[index]) * 10 ** 9).toFixed())
            }
            const gasPriceScanFake = Number((Number(dataBid[6].split(',')) * 10 ** 9 * 2).toFixed())
            let amountBid = 0
            for (let index = 0; index < amountList.length; index++) {
                amountBid += Number(amountList[index]);
            }
            if (false || (Date.now() / 1000 < Number(startTime_[0]) + timeWait + overTime)) {
                var tx = []
                let nonce_ = await web3.eth.getTransactionCount(acc.address);
                if (Number(startTime_[0]) + timeWait - Date.now() / 1000 > 0) {
                    console.log('sleep', Number(startTime_[0]) + timeWait - Date.now() / 1000)
                    await sleep(Math.abs(Number(startTime_[0]) + timeWait - Date.now() / 1000) * 1000);
                }
                if (index_.length > 1) {
                    if (fakeBid == true) {
                        tx.push({
                            from: acc.address,
                            gas: 1000000,
                            gasPrice: gasPriceScanFake,
                            nonce: nonce_,
                            to: contractAddress,
                            value: 0,
                            data: contract.methods.bid(seller_[0].toString(), index_[0].toString(), startTime_[0].toString(), priceList[0].toString(), '1').encodeABI()// amount = 1
                        })
                        nonce_ += 1;
                    }
                    for (let index = 0; index < index_.length; index++) {
                        tx.push(
                            {
                                from: acc.address,
                                gas: 1000000,
                                gasPrice: gasPriceScan[index],
                                nonce: nonce_,
                                to: contractAddress,
                                value: 0,
                                data: contract.methods.bid(seller_[index].toString(), index_[index].toString(), startTime_[index].toString(), priceList[index].toString(), '1').encodeABI()// amount = 1
                            }
                        )
                        nonce_ += 1
                    }
                }
                else if (index_.length == 1) {
                    if (fakeBid == true) {
                        tx.push({
                            from: acc.address,
                            gas: 1000000,
                            gasPrice: gasPriceScanFake,
                            nonce: nonce_,
                            to: contractAddress,
                            value: 0,
                            data: contract.methods.bid(seller_.toString(), index_.toString(), startTime_.toString(), priceList.toString(), amountBid.toString()).encodeABI()// amount = 1 or > 1
                        })
                        nonce_ += 1;
                    }
                    tx.push(
                        {
                            from: acc.address,
                            gas: 1000000,
                            gasPrice: gasPriceScan[0],
                            nonce: nonce_,
                            to: contractAddress,
                            value: 0,
                            data: contract.methods.bid(seller_.toString(), index_.toString(), startTime_.toString(), priceList.toString(), amountBid.toString()).encodeABI()// amount = 1 or > 1
                        }
                    )
                }
                let checkSuccess = 'Success'
                try {
                    console.log('Paying!!')
                    let signed = []
                    let biding = []
                    for (let index = 0; index < tx.length; index++) {
                        signed.push(await web3.eth.accounts.signTransaction(tx[index], Private_Key_))
                    }
                    for (let index = 0; index < tx.length; index++) {
                        if (tx.length == 1) {
                            try {
                                checkSuccess = 'Success'
                                biding[index] = await web3.eth.sendSignedTransaction(signed[index].rawTransaction)
                            } catch (error) {
                                console.log('Bid fail')
                                checkSuccess = 'Fail'
                            }
                            console.log('Successful bid! At block:', biding[index].blockNumber)
                        }
                        else {
                            if (index == tx.length - 1) {
                                try {
                                    checkSuccess = 'Success'
                                    biding[index] = await web3.eth.sendSignedTransaction(signed[index].rawTransaction)
                                } catch (error) {
                                    console.log('Bid fail')
                                    checkSuccess = 'Fail'
                                }
                                console.log('Successful bid! At block:', biding[index].blockNumber)
                            }
                            else {
                                try {
                                    checkSuccess = 'Success'
                                    biding[index] = web3.eth.sendSignedTransaction(signed[index].rawTransaction)
                                } catch (error) {
                                    console.log('Bid fail')
                                    checkSuccess = 'Fail'
                                    next(error)
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.log('Error during bid Auction!');
                    checkSuccess = 'Fail'
                }
                await sleep(1000)
                for (let op = 0; op < idList.length; op++) {
                    idList[op] = idList[op].slice(0, 1)
                }
                try {
                    let price_send = []
                    for (let q = 0; q < priceList.length; q++) {
                        price_send.push(' ' + ((Number(priceList[q]) - 10 ** 14) / 10 ** 18).toFixed(2))
                    }
                    priceList1 = checkSuccess + ' ' + gasPriceScanRaw + '\nPrices   : ' + price_send.toString().replace(' ', '') + '\nAmount: ' + amountList + '\nID List   : ' + idList
                } catch (error) { }
                try {
                    request('https://api.telegram.org/' + apiTele + '/sendMessage?chat_id=@' + chatId + '&text=' + priceList1, function (error, response, body) { });
                } catch (error) { }
            }
            else {
                console.log('Over time (' + overTime.toString() + ' seconds)!!')
            }
            try {// avoid missing auction
                const inputdata = fs.readFileSync('waitBid.txt', 'utf8');
                dataBid = inputdata.split('\n')
                for (let index = dataBid.length - 1; index >= 0; index--) {// bug here -> fixed -> testing
                    if (dataBid[index] == '\r' || dataBid[index] == '') { dataBid.splice(index, 1) }
                }
            } catch (err) { }
            dataBid.splice(0, 7)
            // for (let iii = 1; iii < dataBid.length; iii++) {
            //     dataBid[iii] = '\n' + dataBid[iii]
            // }
            // dataBid[dataBid.length - 1] = dataBid[dataBid.length - 1] + '\n'
            content = ''
            for (let iii = 0; iii < dataBid.length; iii++) {
                if (iii == 0) {
                    content += dataBid[iii].toString()
                }
                else {
                    content += '\n' + dataBid[iii].toString()
                }
            }
            if (dataBid.length) { content += '\n' }// instead of comment ahead
            fs.writeFile('waitBid.txt', content, err => {
                if (err) {
                    console.error(err);
                }
            });
            await sleep(1000)
        }
    }
}
async function init2() {
    try {
        const passData = fs.readFileSync('myAccount_5_8_1.txt', 'utf8');
        myAccount = passData.split('\n')
    } catch (err) {
        console.error(err);
    }
    const Private_Key = myAccount[1]
    acc = web3.eth.accounts.privateKeyToAccount(Private_Key)
    console.log(acc.address)
    while (true) {
        await init(Private_Key)
        await sleep(100)
    }
}
const overTime = 60
const timeWait = 98.4 //timeWait to buy (40 block ~ 120s)1:117 - may buy early, now test 117.2
const timeGetNonce = 4.5
const fakeBid = false
init2()