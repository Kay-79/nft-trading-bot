"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { useTheme } from "@/config/theme";
import Image from "next/image";

const ListingDetail = () => {
    const searchParams = useSearchParams();
    const { theme } = useTheme();
    const [listing, setListing] = useState<AuctionDto | null>(null);

    useEffect(() => {
        const listingData = searchParams.get("listing");
        if (listingData) {
            setListing(JSON.parse(listingData));
        }
    }, [searchParams]);

    if (!listing) {
        return <div>Loading...</div>;
    }

    return (
        <div
            style={{
                padding: "20px",
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}
        >
            <h1 style={{ marginBottom: "20px" }}>Listing Details</h1>
            <div
                style={{
                    backgroundColor: theme.primaryColor,
                    color: theme.textColor,
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    width: "100%",
                    maxWidth: "600px"
                }}
            >
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <Image
                        src={`/images/MOMO/${listing.prototype}.png`}
                        alt="Avatar"
                        width={100}
                        height={100}
                    />
                </div>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>{listing.auctor}</h2>
                <p>Level: {listing.level}</p>
                <p>Hashrate: {listing.hashrate}</p>
                <p>Price: {listing.nowPrice} USDT</p>
                <p>Duration: {listing.durationDays} days</p>
            </div>
        </div>
    );
};

export default ListingDetail;
