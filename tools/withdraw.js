require("dotenv").config();
const config = require("../config/config");
const Web3 = require("web3");
const abiWallet = require("../abi/abiWallet");
const walletAddress = config.wallet.address;
const tokenAddress = config.addressToken;
let web3;
try {
    web3 = new Web3(new Web3.providers.HttpProvider(config.rpcs.public));
} catch (error) {
    web3 = new Web3(new Web3.providers.HttpProvider(config.rpcs.change));
}
const contractWallet = new web3.eth.Contract(abiWallet, walletAddress);

const withdraw = async () => {
    const tx = {
        to: walletAddress,
        data: contractWallet.methods
            .transferToken(
                tokenAddress,
                config.wallet.owner,
                (amountWithdraw * 10 ** 18).toString()
            )
            .encodeABI(),
        value: 0,
        gas: 100000,
        gasPrice: 1000100000
    };
    const signed = await web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY_BID_MAINNET);
    if (config.wallet.owner != "0x55555D4de8df0c455C2Ff368253388FE669a8888") {
        console.warn("Please check wallet address");
        exit();
    }
    await web3.eth.sendSignedTransaction(signed.rawTransaction);
    console.log(`Withdraw successfully ${amountWithdraw} USDT to owner`);
};
// withdraw to owner
const amountWithdraw = 100.0;
withdraw();
