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
    const { theme } = useTheme();

    useEffect(() => {
        // Fetch listings data from API
        fetch("/api/listings")
            .then(response => response.json())
            .then(data => setListings(data));

        // Fetch activities data from API
        fetch("/api/activities")
            .then(response => response.json())
            .then(data => setActivities(data));

        // Fetch inventory data from API
        fetch("/api/inventory")
            .then(response => response.json())
            .then(data => setInventory(data));
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
                        cursor: "pointer"
                    }}
                >
                    Toggle View
                </button>
            </div>
            <div style={{ marginBottom: "40px" }}>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Listings</h2>
                <Listings listings={listings} view={view} />
            </div>
            <div style={{ marginBottom: "40px" }}>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Activities</h2>
                <Activities activities={activities} view={view} />
            </div>
            <div>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Inventory</h2>
                <Inventory inventory={inventory} view={view} />
            </div>
        </div>
    );
};

export default DashboardPage;
