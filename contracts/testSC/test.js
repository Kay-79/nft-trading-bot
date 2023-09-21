const Web3 = require("web3");
const fs = require("fs");
const abi = JSON.parse(fs.readFileSync("./contracts/testSC/abi.json"));
const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-testnet.publicnode.com"));
const contract = new web3.eth.Contract(abi, "0x9C8cE01161CE2A19DBDAbC90FC0b83d460FAbf98");
try {
    const passData = fs.readFileSync("myAccount_7_7_1.txt", "utf8");
    myAccount = passData.split("\n");
    Private_Key = myAccount[1];
} catch (err) {
    console.error(err);
}

const testWeb3 = async () => {
    tx = {
        from: "0x77775a358050DE851b06603864FbD380637C7777",
        gas: 1000000,
        gasPrice: 5 * 10 ** 9,
        to: "0x233E7f130651d257dc36B75E6e13565e3c0a553C",
        value: 0,
        data: contract.methods.approve("0xE5EE9E72202F019c0B20cb521f3bdf1C9e6d3BdE", "0x6baF2130Dd7584aC1fDa5A67e122871378395770").encodeABI(), // amount = 1 or > 1
    };
    signed = await web3.eth.accounts.signTransaction(tx, Private_Key);
    biding = await web3.eth.sendSignedTransaction(signed.rawTransaction);
};

const testWeb3Call = async () => {
    let call = await contract.methods.owner().call();
    console.log(call);
};

testWeb3();
// testWeb3Call();
