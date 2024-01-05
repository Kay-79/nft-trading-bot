require("dotenv").config();
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org"));
const abiWallet = require("../abi/abiWallet");
const config = require("../config/config");
const walletAddress = config.wallet.address;
const contractWallet = new web3.eth.Contract(abiWallet, walletAddress);
const tokenAddress = config.addressToken;

const withdraw = async () => {
    const tx = {
        to: walletAddress,
        data: contractWallet.methods
            .transferToken(tokenAddress, config.wallet.owner, (amountWithdraw * 10 * 18).toFixed())
            .encodeABI(),
        value: 0,
        gas: 100000,
        gasPrice: 3000000000,
    };
    const signed = await web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY_BID);
    await web3.eth.sendSignedTransaction(signed.rawTransaction);
};
// withdraw to owner
const amountWithdraw = 40;
withdraw();
