"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/config/theme";
import { shortenAddress, shortenNumber } from "@/utils/shorten";
import Link from "next/link";
import axios from "axios";
import { AccountConsoleDto } from "@/types/dtos/AccountConsole.dto";
import { addressTester, allContracts } from "@/config/config";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { ConnectWallet } from "@/components/ConnectWallet";
import { NORMAL_BUYER } from "@/constants/constants";

/**
 * @description
 * @returns {JSX.Element}
 */
const Console = () => {
    const { theme } = useTheme();
    const [contractsData, setContracts] = useState<AccountConsoleDto[]>([]);
    const [totals, setTotals] = useState({
        listingsCount: 0,
        totalBalance: 0,
        hash: 0,
        totalPriceSell: 0
    });
    const [loading, setLoading] = useState(true);
    const { address } = useAccount();
    useEffect(() => {
        const fetchContracts = async () => {
            try {
                setLoading(true); // Set loading to true before fetching
                const accounts = await axios
                    .get("/api/accounts")
                    .then(response => (Array.isArray(response.data) ? response.data : []));
                setContracts(accounts);

                // Calculate totals
                const totalListingsCount = accounts.reduce(
                    (sum, acc) => sum + acc.listingsCount,
                    0
                );
                const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
                const totalHash = accounts.reduce((sum, acc) => sum + acc.hash, 0);
                const totalPriceSell = accounts.reduce((sum, acc) => sum + acc.totalPriceSell, 0);

                setTotals({
                    listingsCount: totalListingsCount,
                    totalBalance: totalBalance,
                    hash: totalHash,
                    totalPriceSell: totalPriceSell
                });
            } catch (error) {
                console.error("Error fetching balances:", error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        if (
            address &&
            (allContracts.includes(ethers.getAddress(address as string)) ||
                ethers.getAddress(address as string) === addressTester ||
                ethers.getAddress(address as string) === NORMAL_BUYER)
        ) {
            fetchContracts();
        }
    }, [address]);
    if (!address) {
        return (
            <div
                style={{
                    backgroundColor: theme.backgroundColor,
                    color: theme.textColor,
                    padding: "20px",
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <ConnectWallet />
            </div>
        );
    }

    if (
        !(
            allContracts.includes(ethers.getAddress(address as string)) ||
            ethers.getAddress(address as string) === addressTester ||
            ethers.getAddress(address as string) === NORMAL_BUYER
        )
    ) {
        return (
            <div
                style={{
                    backgroundColor: theme.backgroundColor,
                    color: theme.textColor,
                    padding: "20px",
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <h2 style={{ color: theme.primaryColor }}>
                    Address {shortenAddress(address)} is not in the list of contracts.
                </h2>
                <p style={{ color: theme.textColor }}>
                    Please check your address or contact support.
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div
                style={{
                    backgroundColor: theme.backgroundColor,
                    color: theme.textColor,
                    padding: "20px",
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <div
            style={{
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                padding: "20px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                minHeight: "100vh"
            }}
        >
            <h1 style={{ color: theme.primaryColor }}>
                USDT Balance Tracker ($
                {shortenNumber(totals.totalBalance + totals.totalPriceSell, 0, 2)})
            </h1>
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "10px",
                    backgroundColor: theme.backgroundColor
                }}
            >
                <thead>
                    <tr>
                        <th
                            style={{
                                backgroundColor: theme.primaryColor,
                                color: theme.headerTextColor,
                                padding: "8px",
                                textAlign: "left"
                            }}
                        >
                            Address
                        </th>
                        <th
                            style={{
                                backgroundColor: theme.primaryColor,
                                color: theme.headerTextColor,
                                padding: "8px",
                                textAlign: "left"
                            }}
                        >
                            Listings Count ({totals.listingsCount})
                        </th>
                        <th
                            style={{
                                backgroundColor: theme.primaryColor,
                                color: theme.headerTextColor,
                                padding: "8px",
                                textAlign: "left"
                            }}
                        >
                            USDT Balance (${totals.totalBalance.toFixed(2)})
                        </th>
                        <th
                            style={{
                                backgroundColor: theme.primaryColor,
                                color: theme.headerTextColor,
                                padding: "8px",
                                textAlign: "left"
                            }}
                        >
                            Hashrate ({totals.hash})
                        </th>
                        <th
                            style={{
                                backgroundColor: theme.primaryColor,
                                color: theme.headerTextColor,
                                padding: "8px",
                                textAlign: "left"
                            }}
                        >
                            Total Price Sell (${totals.totalPriceSell.toFixed(2)})
                        </th>
                        <th
                            style={{
                                backgroundColor: theme.primaryColor,
                                color: theme.headerTextColor,
                                padding: "8px",
                                textAlign: "left"
                            }}
                        >
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {contractsData.map(
                        ({ address, listingsCount, balance, hash, totalPriceSell }) => (
                            <tr key={address}>
                                <td
                                    style={{
                                        border: `1px solid ${theme.primaryColor}`,
                                        padding: "8px"
                                    }}
                                >
                                    {shortenAddress(address)}
                                </td>
                                <td
                                    style={{
                                        border: `1px solid ${theme.primaryColor}`,
                                        padding: "8px"
                                    }}
                                >
                                    {listingsCount}
                                </td>
                                <td
                                    style={{
                                        border: `1px solid ${theme.primaryColor}`,
                                        padding: "8px"
                                    }}
                                >
                                    $ {balance}
                                </td>
                                <td
                                    style={{
                                        border: `1px solid ${theme.primaryColor}`,
                                        padding: "8px"
                                    }}
                                >
                                    {hash}
                                </td>
                                <td
                                    style={{
                                        border: `1px solid ${theme.primaryColor}`,
                                        padding: "8px"
                                    }}
                                >
                                    $ {totalPriceSell}
                                </td>
                                <td
                                    style={{
                                        border: `1px solid ${theme.primaryColor}`,
                                        padding: "8px"
                                    }}
                                >
                                    <Link
                                        href={`/console/${address}`}
                                        style={{
                                            color: theme.primaryColor,
                                            textDecoration: "none",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        View Detail
                                    </Link>
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Console;
