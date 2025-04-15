"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/config/theme";
import { erc20Contract } from "@/services/erc20Contract";
import { useParams } from "next/navigation";
import { mpContractService } from "@/services/mpContract";
import { toast } from "react-toastify";
import { allContracts } from "@/config/config";
import { useAccount } from "wagmi";

/**
 * @description Detail page for a specific address
 * @returns {JSX.Element}
 */
const AddressDetail: React.FC = () => {
    const { theme } = useTheme();
    const params = useParams();
    const address = params?.address as string; // Explicitly cast to string
    const [balance, setBalance] = useState<number | null>(null);
    const [transferAmount, setTransferAmount] = useState<number>(0);
    const [transferTo, setTransferTo] = useState<string>("");
    const { address: userAddress } = useAccount();

    useEffect(() => {
        const fetchDetails = async () => {
            if (address) {
                try {
                    // Fetch USDT balance
                    const fetchedBalance = await erc20Contract.getBalance(address);
                    setBalance(fetchedBalance);
                } catch (error) {
                    console.error("Error fetching details:", error);
                }
            }
        };

        fetchDetails();
    }, [address]);

    const handleTransfer = async () => {
        try {
            if (address && transferTo && transferAmount > 0) {
                await mpContractService.transferERC20(
                    userAddress as `0x${string}`,
                    address,
                    transferTo,
                    transferAmount
                );
                toast.success("Transfer successful!");
            } else {
                toast.error("Please fill in all fields correctly!");
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message.length > 100
                        ? "Transfer failed!"
                        : error.message
                    : "An unknown error occurred.";
            toast.error(errorMessage);
        }
    };

    if (!address) {
        return <div>Loading...</div>;
    }

    return (
        <div
            style={{
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                minHeight: "100vh"
            }}
        >
            <h1 style={{ color: theme.primaryColor }}>Address Detail</h1>
            <p>
                <strong>Address:</strong> {address}
            </p>
            <p>
                <strong>USDT Balance:</strong> {balance !== null ? `$ ${balance}` : "Loading..."}
            </p>
            <div style={{ marginTop: "20px" }}>
                <h3>Transfer USDT</h3>
                <select
                    value={transferTo}
                    onChange={e => setTransferTo(e.target.value)}
                    style={{
                        padding: "10px",
                        marginRight: "10px",
                        border: `1px solid ${theme.primaryColor}`,
                        borderRadius: "4px",
                        color: "#000"
                    }}
                >
                    <option value="" disabled>
                        Select Recipient Address
                    </option>
                    {allContracts.map(contract => (
                        <option key={contract} value={contract}>
                            {contract}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Or Enter Recipient Address"
                    value={transferTo}
                    onChange={e => setTransferTo(e.target.value)}
                    style={{
                        padding: "10px",
                        marginRight: "10px",
                        border: `1px solid ${theme.primaryColor}`,
                        borderRadius: "4px",
                        color: "#000"
                    }}
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={transferAmount || (balance ?? 0) - 0.1}
                    onChange={e => setTransferAmount(Number(e.target.value))}
                    style={{
                        padding: "10px",
                        marginRight: "10px",
                        border: `1px solid ${theme.primaryColor}`,
                        borderRadius: "4px",
                        color: "#000"
                    }}
                />
                {userAddress && (
                    <button
                        onClick={handleTransfer}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: theme.primaryButtonBackgroundColor,
                            color: theme.primaryButtonTextColor,
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        Transfer
                    </button>
                )}
            </div>
            <button
                onClick={() => window.history.back()}
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    backgroundColor: theme.secondaryButtonBackgroundColor,
                    color: theme.secondaryButtonTextColor,
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                }}
            >
                Go Back
            </button>
        </div>
    );
};

export default AddressDetail;
