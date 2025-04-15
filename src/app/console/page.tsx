"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/config/theme";
import { contracts } from "@/config/config";
import { erc20Contract } from "@/services/erc20Contract";
import { shortenAddress } from "@/utils/shorten";
import Link from "next/link";
import { mpContractService } from "@/services/mpContract";

/**
 * @description
 * @returns {JSX.Element}
 */
const Console = () => {
    const { theme } = useTheme();
    const [contractsData, setContracts] = useState<
        { address: string; balance: number; hash: number }[]
    >([]);
    const totalBalance = contractsData.reduce((acc, { balance }) => acc + balance, 0);

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                const results = await Promise.all(
                    contracts.map(async address => {
                        const balance = await erc20Contract.getBalance(address);
                        const hash = await mpContractService.getUserHash(address);
                        return { address, balance, hash };
                    })
                );
                setContracts(results);
            } catch (error) {
                console.error("Error fetching balances:", error);
            }
        };
        fetchContracts();
    }, []);

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
            <h1 style={{ color: theme.primaryColor }}>USDT Balance Tracker</h1>
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
                            USDT Balance (${totalBalance})
                        </th>
                        <th
                            style={{
                                backgroundColor: theme.primaryColor,
                                color: theme.headerTextColor,
                                padding: "8px",
                                textAlign: "left"
                            }}
                        >
                            Hash
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
                    {contractsData.map(({ address, balance, hash }) => (
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
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Console;
