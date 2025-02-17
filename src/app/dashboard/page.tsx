"use client";

import React, { useState, useEffect } from "react";
import Listings from "@/components/Dashboard/Listings";
import Activities from "@/components/Dashboard/Activities";
import Inventory from "@/components/Dashboard/Inventory";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { RecentSold } from "@/types/dtos/RecentSold.dto";
import { Momo721 } from "@/types/dtos/Momo721";
import { useTheme } from "@/config/theme";

const DashboardPage = () => {
    const [listings, setListings] = useState<AuctionDto[]>([]);
    const [activities, setActivities] = useState<RecentSold[]>([]);
    const [inventory, setInventory] = useState<Momo721[]>([]);
    const [view, setView] = useState<"list" | "card">("list");
    const [selectedSection, setSelectedSection] = useState<"listings" | "activities" | "inventory">(
        "listings"
    );
    const { theme } = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            const [listingsData, activitiesData, inventoryData] = await Promise.all([
                fetch("/api/listings").then(response => response.json()),
                fetch("/api/activities").then(response => response.json()),
                fetch("/api/inventory").then(response => response.json())
            ]);

            setListings(listingsData);
            setActivities(activitiesData);
            setInventory(inventoryData);
        };

        fetchData();
    }, []);

    return (
        <div
            style={{
                padding: "20px",
                backgroundColor: theme.backgroundColor,
                color: theme.textColor
            }}
        >
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Dashboard</h1>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <button
                    onClick={() => setView(view === "list" ? "card" : "list")}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: theme.buttonBackgroundColor,
                        color: theme.buttonTextColor,
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginRight: "10px"
                    }}
                >
                    Toggle View
                </button>
                <select
                    value={selectedSection}
                    onChange={e =>
                        setSelectedSection(
                            e.target.value as "listings" | "activities" | "inventory"
                        )
                    }
                    style={{
                        padding: "10px 20px",
                        backgroundColor: theme.buttonBackgroundColor,
                        color: theme.buttonTextColor,
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    <option value="listings">Listings</option>
                    <option value="activities">Activities</option>
                    <option value="inventory">Inventory</option>
                </select>
            </div>
            {selectedSection === "listings" && (
                <div style={{ marginBottom: "40px" }}>
                    <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Listings</h2>
                    <Listings listings={listings} view={view} />
                </div>
            )}
            {selectedSection === "activities" && (
                <div style={{ marginBottom: "40px" }}>
                    <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Activities</h2>
                    <Activities activities={activities} view={view} />
                </div>
            )}
            {selectedSection === "inventory" && (
                <div>
                    <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Inventory</h2>
                    <Inventory inventory={inventory} view={view} />
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
