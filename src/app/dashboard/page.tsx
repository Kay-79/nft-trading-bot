"use client";

import React, { useState, useEffect } from "react";
import Listings from "@/components/Dashboard/Listings";
import Activities from "@/components/Dashboard/Activities";
import Inventories from "@/components/Dashboard/Inventory";
import Markets from "@/components/Dashboard/Markets";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { RecentSoldDto } from "@/types/dtos/RecentSold.dto";
import { useTheme } from "@/config/theme";
import FilterPanel, { FilterParams, SortOptions } from "@/components/Dashboard/FilterPanel";
import Loading from "@/components/Loading/Loading";
import { FaArrowUp } from "react-icons/fa";
import { MdSell } from "react-icons/md";
import { InventoryDto } from "@/types/dtos/Inventory.dto";
import BulkSellModal from "@/components/Modal/BulkSellModal";
import axios from "axios";

const DashboardPage = () => {
    const [listings, setListings] = useState<AuctionDto[]>([]);
    const [activities, setActivities] = useState<RecentSoldDto[]>([]);
    const [inventory, setInventory] = useState<InventoryDto[]>([]);
    const [markets, setMarkets] = useState<AuctionDto[]>([]);
    const [filteredListings, setFilteredListings] = useState<AuctionDto[]>([]);
    const [filteredActivities, setFilteredActivities] = useState<RecentSoldDto[]>([]);
    const [filteredInventory, setFilteredInventory] = useState<InventoryDto[]>([]);
    const [selectedSection, setSelectedSection] = useState<
        "listings" | "activities" | "inventory" | "markets"
    >("listings");
    const [loading, setLoading] = useState<boolean>(false);
    const { theme } = useTheme();
    const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
    const [isBulkSellModalOpen, setIsBulkSellModalOpen] = useState<boolean>(false);

    // Manage filterParams as state
    const [filterParams, setFilterParams] = useState<FilterParams>({
        minPrice: 0,
        maxPrice: 0, // Added maxPrice
        minHashrate: 0,
        maxHashrate: 0, // Added maxHashrate
        search: "",
        sort: SortOptions.Time,
        vType: ""
    });

    const fetchListings = async () => {
        setLoading(true);
        const listingsData = await fetch("/api/listings").then(response => response.json());
        setListings(listingsData);
        setFilteredListings(listingsData);
        setLoading(false);
    };

    const fetchActivities = React.useCallback(async () => {
        setLoading(true);
        const activitiesData = await axios.get("/api/activities");
        setActivities(activitiesData.data);
        setFilteredActivities(activitiesData.data);
        setLoading(false);
    }, []);

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
    }, [
        selectedSection,
        activities.length,
        inventory.length,
        listings.length,
        markets.length,
        fetchActivities
    ]);

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

    const handleSectionChange = (section: "listings" | "activities" | "inventory" | "markets") => {
        setSelectedSection(section);
    };

    const handleCloseModal = () => {
        setIsBulkSellModalOpen(false);
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
            <FilterPanel filterParams={filterParams} setFilterParams={setFilterParams} />
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
                            cursor: "pointer",
                            marginRight: "10px"
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
                    {selectedSection === "inventory" ? (
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                            <MdSell
                                style={{ cursor: "pointer" }}
                                onClick={() => setIsBulkSellModalOpen(true)}
                            />
                        </div>
                    ) : null}
                </div>
                <div style={{ flex: 1 }}>
                    {loading ? (
                        <Loading />
                    ) : (
                        <>
                            {selectedSection === "listings" && (
                                <div style={{ marginBottom: "40px" }}>
                                    <Listings
                                        listings={filteredListings}
                                        filterParams={filterParams}
                                    />
                                </div>
                            )}
                            {selectedSection === "activities" && (
                                <div style={{ marginBottom: "40px" }}>
                                    <Activities activities={filteredActivities} view="list" />
                                </div>
                            )}
                            {selectedSection === "inventory" && (
                                <div>
                                    <Inventories
                                        inventories={filteredInventory}
                                        listings={listings}
                                    />
                                </div>
                            )}
                            {selectedSection === "markets" && (
                                <div style={{ marginBottom: "40px" }}>
                                    <Markets filterParams={filterParams} />
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
            {isBulkSellModalOpen && selectedSection === "inventory" && (
                <BulkSellModal onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default DashboardPage;
