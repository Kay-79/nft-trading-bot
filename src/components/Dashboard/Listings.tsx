import React from "react";
import { AuctionDto } from "@/types/dtos/Auction.dto";

interface ListingsProps {
    listings: AuctionDto[];
    view: "list" | "card";
}

const Listings: React.FC<ListingsProps> = ({ listings, view }) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: view === "list" ? "column" : "row",
                flexWrap: "wrap",
                gap: "20px"
            }}
        >
            {listings.map(listing => (
                <div
                    key={listing.id}
                    style={{
                        padding: "20px",
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        width: view === "list" ? "100%" : "calc(33.333% - 20px)"
                    }}
                >
                    <h3>{listing.auctor}</h3>
                    <p>Start Price: {listing.startPrice}</p>
                    <p>End Price: {listing.endPrice}</p>
                    <p>Duration: {listing.durationDays} days</p>
                    {/* Add more fields as needed */}
                </div>
            ))}
        </div>
    );
};

export default Listings;
