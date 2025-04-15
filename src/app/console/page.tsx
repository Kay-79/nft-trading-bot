"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/config/theme";
import { contracts } from "@/config/config";
import { erc20Contract } from "@/services/erc20Contract";

/**
 * @description
 * @returns {JSX.Element}
 */
const Console = () => {
    const { theme } = useTheme();
    const [balances, setBalances] = useState<{ address: string; balance: number }[]>([]);
    const totalBalance = balances.reduce((acc, { balance }) => acc + balance, 0);

    useEffect(() => {
        const fetchBalances = async () => {
            try {
                const results = await Promise.all(
                    contracts.map(async address => {
                        const balance = await erc20Contract.getBalance(address);
                        return { address, balance };
                    })
                );
                setBalances(results);
            } catch (error) {
                console.error("Error fetching balances:", error);
            }
        };

        fetchBalances();
    }, []);

    return (
        <div
            style={{
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
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
                    </tr>
                </thead>
                <tbody>
                    {balances.map(({ address, balance }) => (
                        <tr key={address}>
                            <td
                                style={{
                                    border: `1px solid ${theme.primaryColor}`,
                                    padding: "8px"
                                }}
                            >
                                {address}
                            </td>
                            <td
                                style={{
                                    border: `1px solid ${theme.primaryColor}`,
                                    padding: "8px"
                                }}
                            >
                                ${balance}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Console;
