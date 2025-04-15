"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/config/theme";
import { erc20Contract } from "@/services/erc20Contract";
import { useParams } from "next/navigation";
import { mpContractService } from "@/services/mpContract";
import { toast } from "react-toastify";
// import { mpContractService } from "@/services/mpContract";

/**
 * @description Detail page for a specific address
 * @returns {JSX.Element}
 */
const AddressDetail = () => {
    const { theme } = useTheme();
    const params = useParams();
    const address = params?.address; // Extract the address from the URL
    const [balance, setBalance] = useState<number | null>(null);
    // const [nftsOnSale, setNftsOnSale] = useState<number>(0);
    // const [nftsOwned, setNftsOwned] = useState<number>(0);
    const [transferAmount, setTransferAmount] = useState<number>(0);
    const [transferTo, setTransferTo] = useState<string>("");

    useEffect(() => {
        const fetchDetails = async () => {
            if (address) {
                try {
                    // Fetch USDT balance
                    const fetchedBalance = await erc20Contract.getBalance(address as string);
                    setBalance(fetchedBalance);

                    // // Fetch NFTs on sale (mocked for now)
                    // const onSale = await mpContractService.getNftsOnSale(address as string);
                    // setNftsOnSale(onSale);

                    // // Fetch NFTs owned (mocked for now)
                    // const owned = await mpContractService.getNftsOwned(address as string);
                    // setNftsOwned(owned);
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
                    address as string,
                    transferTo,
                    transferAmount
                );
                toast.success("Transfer successful!");
            }
            else {
                toast.error("Please fill in all fields correctly!");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Transfer failed!";
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
            {/* <p>
                <strong>NFTs on Sale:</strong> {nftsOnSale}
            </p>
            <p>
                <strong>NFTs Owned:</strong> {nftsOwned}
            </p> */}
            <div style={{ marginTop: "20px" }}>
                <h3>Transfer USDT</h3>
                <input
                    type="text"
                    placeholder="Recipient Address"
                    value={transferTo}
                    onChange={e => setTransferTo(e.target.value)}
                    style={{
                        padding: "10px",
                        marginRight: "10px",
                        border: `1px solid ${theme.primaryColor}`,
                        borderRadius: "4px"
                    }}
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={transferAmount}
                    onChange={e => setTransferAmount(Number(e.target.value))}
                    style={{
                        padding: "10px",
                        marginRight: "10px",
                        border: `1px solid ${theme.primaryColor}`,
                        borderRadius: "4px"
                    }}
                />
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
