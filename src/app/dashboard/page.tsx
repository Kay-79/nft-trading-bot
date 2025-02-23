"use client";

import React, { useState, useEffect } from "react";
import Listings from "@/components/Dashboard/Listings";
import Activities from "@/components/Dashboard/Activities";
import Inventory from "@/components/Dashboard/Inventory";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { RecentSold } from "@/types/dtos/RecentSold.dto";
import { Momo721 } from "@/types/dtos/Momo721";
import { useTheme } from "@/config/theme";
import FilterPanel from "@/components/Dashboard/FilterPanel";

const DashboardPage = () => {
    const [listings, setListings] = useState<AuctionDto[]>([]);
    const [activities, setActivities] = useState<RecentSold[]>([]);
    const [inventory, setInventory] = useState<Momo721[]>([]);
    const [filteredListings, setFilteredListings] = useState<AuctionDto[]>([]);
    const [filteredActivities, setFilteredActivities] = useState<RecentSold[]>([]);
    const [filteredInventory, setFilteredInventory] = useState<Momo721[]>([]);
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
            setFilteredListings(listingsData);
            setFilteredActivities(activitiesData);
            setFilteredInventory(inventoryData);
        };

        fetchData();
    }, []);

    interface Filter {
        minPrice: number;
        minHashrate: number;
        search: string;
        sort: string;
    }

    const applyFilter = (filter: Filter) => {
        setFilteredListings(
            listings
                .filter(listing => (listing.nowPrice || 0) >= filter.minPrice)
                .filter(listing => (listing.hashrate || 0) >= filter.minHashrate)
                .filter(listing => (listing.prototype || 0).toString().includes(filter.search))
                .sort((a, b) => {
                    if (filter.sort === "price") {
                        return (a.nowPrice || 0) - (b.nowPrice || 0);
                    } else if (filter.sort === "hashrate") {
                        return (a.hashrate || 0) - (b.hashrate || 0);
                    } else if (filter.sort === "level") {
                        return (a.level || 0) - (b.level || 0);
                    }
                    return 0;
                })
        );
        setFilteredActivities(
            activities.filter(
                activity =>
                    activity.bidPrice !== undefined &&
                    activity.bidPrice / 10 ** 9 >= filter.minPrice
            )
        );
        setFilteredInventory(
            inventory.filter(
                item => item.hashrate !== undefined && item.hashrate >= filter.minHashrate
            )
        );
    };

    return (
        <div
            style={{
                padding: "20px",
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                minHeight: "100vh", // Ensure the container takes up the full height of the viewport
                display: "flex",
                flexDirection: "row"
            }}
        >
            <div style={{ width: "250px", marginRight: "20px" }}>
                <FilterPanel applyFilter={applyFilter} />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <label
                        onClick={() => setSelectedSection("listings")}
                        style={{
                            padding: "10px 20px",
                            backgroundColor:
                                selectedSection === "listings"
                                    ? theme.buttonBackgroundColor
                                    : "transparent",
                            color: theme.textColor,
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginRight: "10px"
                        }}
                    >
                        Listings
                    </label>
                    <label
                        onClick={() => setSelectedSection("activities")}
                        style={{
                            padding: "10px 20px",
                            backgroundColor:
                                selectedSection === "activities"
                                    ? theme.buttonBackgroundColor
                                    : "transparent",
                            color: theme.textColor,
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginRight: "10px"
                        }}
                    >
                        Activities
                    </label>
                    <label
                        onClick={() => setSelectedSection("inventory")}
                        style={{
                            padding: "10px 20px",
                            backgroundColor:
                                selectedSection === "inventory"
                                    ? theme.buttonBackgroundColor
                                    : "transparent",
                            color: theme.textColor,
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                    >
                        Inventory
                    </label>
                </div>
                <div style={{ flex: 1 }}>
                    {selectedSection === "listings" && (
                        <div style={{ marginBottom: "40px" }}>
                            <Listings listings={filteredListings} />
                        </div>
                    )}
                    {selectedSection === "activities" && (
                        <div style={{ marginBottom: "40px" }}>
                            <Activities activities={filteredActivities} view="list" />
                        </div>
                    )}
                    {selectedSection === "inventory" && (
                        <div>
                            <Inventory inventory={filteredInventory} view="list" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
