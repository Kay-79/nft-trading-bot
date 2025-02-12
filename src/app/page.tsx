"use client";

import { useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-4">Welcome to the Landing Page</h1>
            {isConnected ? (
                <div>
                    <p className="text-lg mb-4">Connected Account: {address}</p>
                    <button
                        onClick={() => disconnect()}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Disconnect
                    </button>
                </div>
            ) : (
                <div>
                    <ConnectButton />
                </div>
            )}
        </div>
    );
}
