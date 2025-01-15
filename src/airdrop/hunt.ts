import axios from "axios";
import { ethers } from "ethers";
import fs from "fs";
const JSON_FILE = "./src/airdrop/accounts.json";

interface Airdrop {
    address: string;
    privateKey: string;
    complete: boolean;
    score: number;
    latestClaim: number;
}
const readAccounts = (): Airdrop[] => {
    if (fs.existsSync(JSON_FILE)) {
        const data = fs.readFileSync(JSON_FILE, "utf-8");
        return JSON.parse(data);
    }
    return [];
};

const writeAccounts = (accounts: Airdrop[]) => {
    fs.writeFileSync(JSON_FILE, JSON.stringify(accounts, null, 2));
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

interface ClaimResponse {
    succeed: boolean;
    score: number;
}

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
        const response = await axios.post("https://nftapi.mobox.io/new_third_annual/claim", data, {
            headers
        });
        console.log(`Account ${account.address} claim response:`, response.data);
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
    let accounts = readAccounts();
    while (true) {
        const now = Math.floor(Date.now() / 1000);
        let updated = false;
        for (const account of accounts) {
            if (!account.complete || now - account.latestClaim > 86400) {
                const claimResult = await claimAirdrop(account);
                if (claimResult.succeed) {
                    account.complete = true;
                    account.latestClaim = now;
                    account.score = claimResult.score;
                    updated = true;
                }
            }
        }
        if (accounts.every(acc => acc.complete)) {
            console.log("All accounts completed. Creating a new account.");
            const newAccount = createNewAccount();
            accounts.push(newAccount);
            const success = await claimAirdrop(newAccount);
            if (success) {
                newAccount.complete = true;
                newAccount.latestClaim = now;
                updated = true;
            }
        }
        if (updated) {
            writeAccounts(accounts);
        }
        console.log("Waiting for the next claim cycle...");
        break;
    }
};

huntAirdrop();
