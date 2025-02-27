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
import Loading from "@/components/Loading/Loading";
import { shortenNumber } from "@/utils/shorten";

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
    const [loading, setLoading] = useState<boolean>(false);
    const { theme } = useTheme();

    const fetchListings = async () => {
        setLoading(true);
        const listingsData = await fetch("/api/listings").then(response => response.json());
        setListings(listingsData);
        setFilteredListings(listingsData);
        setLoading(false);
    };

    const fetchActivities = async () => {
        setLoading(true);
        const activitiesData = await fetch("/api/activities").then(response => response.json());
        setActivities(activitiesData);
        setFilteredActivities(activitiesData);
        setLoading(false);
    };

    const fetchInventory = async () => {
        setLoading(true);
        const inventoryData = await fetch("/api/inventory").then(response => response.json());
        setInventory(inventoryData);
        setFilteredInventory(inventoryData);
        setLoading(false);
    };

    useEffect(() => {
        if (selectedSection === "listings" && listings.length === 0) {
            fetchListings();
        } else if (selectedSection === "activities" && activities.length === 0) {
            fetchActivities();
        } else if (selectedSection === "inventory" && inventory.length === 0) {
            fetchInventory();
        }
    }, [selectedSection, activities.length, inventory.length, listings.length]);

    interface Filter {
        minPrice: number;
        minHashrate: number;
        search: string;
        sort: string;
        sortOrder: string;
    }

    const applyFilter = (filter: Filter) => {
        setFilteredListings(
            listings
                .filter(listing => shortenNumber(listing.nowPrice || 0, 9, 3) >= filter.minPrice)
                .filter(listing => (listing.hashrate || 0) >= filter.minHashrate)
                .filter(listing => (listing.prototype || 0).toString().includes(filter.search))
                .sort((a, b) => {
                    let comparison = 0;
                    if (filter.sort === "price") {
                        comparison = (a.nowPrice || 0) - (b.nowPrice || 0);
                    } else if (filter.sort === "hashrate") {
                        comparison = (a.hashrate || 0) - (b.hashrate || 0);
                    } else if (filter.sort === "level") {
                        comparison = (a.level || 0) - (b.level || 0);
                    } else if (filter.sort === "uptime") {
                        comparison = (a.uptime || 0) - (b.uptime || 0);
                    }
                    return filter.sortOrder === "asc" ? comparison : -comparison;
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

    const handleSectionChange = (section: "listings" | "activities" | "inventory") => {
        setSelectedSection(section);
    };

    return (
        <div
            style={{
                padding: "20px",
                paddingLeft: "290px", // Adjust padding to accommodate the fixed FilterPanel
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <FilterPanel applyFilter={applyFilter} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <label
                        onClick={() => handleSectionChange("listings")}
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
                        onClick={() => handleSectionChange("activities")}
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
                        onClick={() => handleSectionChange("inventory")}
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
                    {loading ? (
                        <Loading />
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
