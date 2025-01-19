import axios from "axios";
import { ethers } from "ethers";
import fs from "fs";
import { ranSleep } from "utilsV2/common/sleep";
const JSON_FILE_COMPLETE = "./src/airdrop/accountsComplete.json";
const JSON_FILE_PROGRESS = "./src/airdrop/accountsProgress.json";

interface Airdrop {
    address: string;
    privateKey: string;
    complete: boolean;
    score: number;
    latestClaim: number;
}
interface ClaimResponse {
    succeed: boolean;
    score: number;
}
const readAccountsComplete = (): Airdrop[] => {
    if (fs.existsSync(JSON_FILE_COMPLETE)) {
        const data = fs.readFileSync(JSON_FILE_COMPLETE, "utf-8");
        return JSON.parse(data);
    }
    return [];
};
const readAccountsProgress = (): Airdrop[] => {
    if (fs.existsSync(JSON_FILE_PROGRESS)) {
        const data = fs.readFileSync(JSON_FILE_PROGRESS, "utf-8");
        return JSON.parse(data);
    }
    return [];
};
const writeAccountsComplete = (accounts: Airdrop[]) => {
    const existAccountsComplete = readAccountsComplete();
    accounts = accounts.concat(existAccountsComplete);
    console.log(`Total complete accounts:`, accounts.length);
    fs.writeFileSync(JSON_FILE_COMPLETE, JSON.stringify(accounts, null, 2));
};
const writeAccountsProgress = (accounts: Airdrop[]) => {
    fs.writeFileSync(JSON_FILE_PROGRESS, JSON.stringify(accounts, null, 2));
};
const createNewAccount = (): Airdrop => {
    const privateKey = ethers.Wallet.createRandom().privateKey;
    const wallet = new ethers.Wallet(privateKey);
    return {
        address: wallet.address,
        privateKey: privateKey,
        complete: false,
        score: 0,
        latestClaim: 0
    };
};
const claimAirdrop = async (account: Airdrop): Promise<ClaimResponse> => {
    const message = "mobox_momo_server_" + Math.floor(Date.now() / (1000 * 3600));
    const wallet = new ethers.Wallet(account.privateKey);
    const signature = await wallet.signMessage(message);
    const headers = {
        accept: "application/json, text/plain, */*",
        "content-type": "application/json",
        origin: "https://www.mobox.io",
        referer: "https://www.mobox.io/",
        "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    };
    const data = {
        owner: wallet.address,
        sign: signature,
        type: 0
    };
    try {
        console.log(`Account ${account.address} claim start...`);
        const response = await axios.post("https://nftapi.mobox.io/new_third_annual/claim", data, {
            headers
        });
        console.log(
            `Account ${account.address} claim response:\n\tSuccess: ${response.data.succeed}\n\tScore: ${response.data.score}`
        );
        return response.data as ClaimResponse;
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Failed to claim for account ${account.address}:`, error.message);
        } else {
            console.error(`Failed to claim for account ${account.address}:`, error);
        }
        return { succeed: false, score: 0 };
    }
};

const huntAirdrop = async () => {
    while (true) {
        let accounts: Airdrop[] = readAccountsProgress();
        if (!Array.isArray(accounts)) {
            accounts = [];
        }
        let accountsCanClaim = accounts.filter(account => {
            const lastClaimDate = new Date(account.latestClaim * 1000).toISOString().slice(0, 10);
            const currentDate = new Date().toISOString().slice(0, 10);
            return lastClaimDate !== currentDate;
        });
        let staticAccounts: { [key: number]: Airdrop[] } = {
            5: [],
            10: [],
            15: [],
            20: [],
            25: [],
            30: [],
            35: [],
            40: []
        };
        accounts.forEach(account => {
            if (account.score === 5) {
                staticAccounts[5].push(account);
            } else if (account.score === 10) {
                staticAccounts[10].push(account);
            } else if (account.score === 15) {
                staticAccounts[15].push(account);
            } else if (account.score === 20) {
                staticAccounts[20].push(account);
            } else if (account.score === 25) {
                staticAccounts[25].push(account);
            } else if (account.score === 30) {
                staticAccounts[30].push(account);
            } else if (account.score === 35) {
                staticAccounts[35].push(account);
            } else if (account.score === 40) {
                staticAccounts[40].push(account);
            }
        });
        console.log(`Statistics:
            5: ${staticAccounts[5].length}
            10: ${staticAccounts[10].length}
            15: ${staticAccounts[15].length}
            20: ${staticAccounts[20].length}
            25: ${staticAccounts[25].length}
            30: ${staticAccounts[30].length}
            35: ${staticAccounts[35].length}
            40: ${staticAccounts[40].length}`);
        accountsCanClaim = accountsCanClaim.sort(() => Math.random() - 0.5);
        if (accountsCanClaim.length === 0) {
            const newAccount = createNewAccount();
            accounts.push(newAccount);
            accountsCanClaim.push(newAccount);
            console.log(`Create new account ${newAccount.address}`);
        }
        let amount = accountsCanClaim.length;
        for (let i = 0; i < accountsCanClaim.length; i++) {
            console.log("######################################################################");
            console.log(`Progress: \x1b[33m${accounts.length - amount}/${accounts.length}\x1b[0m`);
            const account = accountsCanClaim[i];
            const response = await claimAirdrop(account);
            if (response.succeed) {
                amount--;
                account.score += response.score;
                account.latestClaim = Date.now() / 1000;
                const isComplete = (score: number) => {
                    const ranScore = Math.floor(Math.random() * 20);
                    return score + ranScore >= 50;
                };
                if (isComplete(account.score)) {
                    account.complete = true;
                }
                const accountsComplete = accounts.filter(account => account.complete);
                if (accountsComplete.length > 0) {
                    writeAccountsComplete(accountsComplete);
                }
                accounts = accounts.filter(account => !account.complete);
                writeAccountsProgress(accounts);
            }
            console.log(
                `Account ${account.address} claim end, score: ${account.score}. Sleep 30-60s...`
            );
            await ranSleep(30, 60);
        }
        if (accountsCanClaim.length === 0) {
            console.log("No account can claim, sleep 30-60s...");
            await ranSleep(30, 60);
        }
    }
};

huntAirdrop();
