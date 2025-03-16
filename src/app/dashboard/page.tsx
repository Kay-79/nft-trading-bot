"use client";

import React, { useState, useEffect } from "react";
import Listings from "@/components/Dashboard/Listings";
import Activities from "@/components/Dashboard/Activities";
import Inventories from "@/components/Dashboard/Inventory";
import Markets from "@/components/Dashboard/Markets";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { RecentSoldDto } from "@/types/dtos/RecentSold.dto";
import { useTheme } from "@/config/theme";
import FilterPanel from "@/components/Dashboard/FilterPanel";
import Loading from "@/components/Loading/Loading";
import { shortenNumber } from "@/utils/shorten";
import { FaArrowUp } from "react-icons/fa";
import { InventoryDto } from "@/types/dtos/Inventory.dto";

const DashboardPage = () => {
    const [listings, setListings] = useState<AuctionDto[]>([]);
    const [activities, setActivities] = useState<RecentSoldDto[]>([]);
    const [inventory, setInventory] = useState<InventoryDto[]>([]);
    const [markets, setMarkets] = useState<AuctionDto[]>([]);
    const [filteredListings, setFilteredListings] = useState<AuctionDto[]>([]);
    const [filteredActivities, setFilteredActivities] = useState<RecentSoldDto[]>([]);
    const [filteredInventory, setFilteredInventory] = useState<InventoryDto[]>([]);
    const [filteredMarkets, setFilteredMarkets] = useState<AuctionDto[]>([]);
    const [selectedSection, setSelectedSection] = useState<
        "listings" | "activities" | "inventory" | "markets"
    >("inventory");
    const [loading, setLoading] = useState<boolean>(false);
    const { theme } = useTheme();
    const [showScrollTop, setShowScrollTop] = useState<boolean>(false); // Added state for scroll top button

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

    const fetchMarkets = async () => {
        setLoading(true);
        const marketsData = await fetch("/api/markets").then(response => response.json());
        setMarkets(marketsData);
        setFilteredMarkets(marketsData);
        setLoading(false);
    };

    useEffect(() => {
        if (selectedSection === "listings" && listings.length === 0) {
            fetchListings();
        } else if (selectedSection === "activities" && activities.length === 0) {
            fetchActivities();
        } else if (selectedSection === "inventory" && inventory.length === 0) {
            fetchInventory();
        } else if (selectedSection === "markets" && markets.length === 0) {
            fetchMarkets();
        }
    }, [selectedSection, activities.length, inventory.length, listings.length, markets.length]);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 200);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

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
                .filter(listing =>
                    (listing.prototype + (listing.auctor ?? "")).toLowerCase().includes((filter.search).toLowerCase())
                )
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
                    } else if (filter.sort === "prototype") {
                        comparison = (a.prototype || 0) - (b.prototype || 0);
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
            inventory
                .filter(item => item.hashrate !== undefined && item.hashrate >= filter.minHashrate)
                .filter(i => i.prototype.toString().includes(filter.search))
                .sort((a, b) => {
                    let comparison = 0;
                    if (filter.sort === "hashrate") {
                        comparison = (a.hashrate || 0) - (b.hashrate || 0);
                    } else if (filter.sort === "level") {
                        comparison = (a.level || 0) - (b.level || 0);
                    } else if (filter.sort === "prototype") {
                        comparison = (a.prototype || 0) - (b.prototype || 0);
                    }
                    return filter.sortOrder === "asc" ? comparison : -comparison;
                })
        );
    };

    const handleSectionChange = (section: "listings" | "activities" | "inventory" | "markets") => {
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
                    <label
                        onClick={() => handleSectionChange("markets")}
                        style={{
                            padding: "10px 20px",
                            backgroundColor:
                                selectedSection === "markets"
                                    ? theme.buttonBackgroundColor
                                    : "transparent",
                            color: theme.textColor,
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                    >
                        Markets
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
                                    <Inventories inventories={filteredInventory} />
                                </div>
                            )}
                            {selectedSection === "markets" && (
                                <div style={{ marginBottom: "40px" }}>
                                    <Markets markets={filteredMarkets} />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    style={{
                        position: "fixed",
                        bottom: "50px",
                        right: "10px",
                        backgroundColor: theme.buttonBackgroundColor,
                        color: theme.textColor,
                        border: "none",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)"
                    }}
                >
                    <FaArrowUp />
                </button>
            )}
        </div>
    );
};

export default DashboardPage;
