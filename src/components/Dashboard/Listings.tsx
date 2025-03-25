import React from "react";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import ListingCard from "@/components/Card/ListingCard";
import { shortenNumber } from "@/utils/shorten";

interface ListingsProps {
    listings: AuctionDto[];
}

const Listings: React.FC<ListingsProps> = ({ listings }) => {
    const validListings = Array.isArray(listings) ? listings : [];
    const totalPrice = shortenNumber(
        validListings.reduce((sum, listing) => sum + (listing.nowPrice || 0), 0),
        9,
        3
    );
    const totalListings = validListings.length;

    return (
        <div>
            <div style={{ textAlign: "right", marginBottom: "20px" }}>
                <p style={{ margin: 0 }}>Total Price: {totalPrice.toFixed(2)} USDT</p>
                <p style={{ margin: 0 }}>Total Listings: {totalListings}</p>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: "20px",
                    justifyContent: "center"
                }}
            >
                {validListings.map(listing => (
                    <ListingCard key={listing.id} listing={listing} />
                ))}
                <style jsx>{`
                    @media (max-width: 768px) {
                        div {
                            flex-direction: column;
                            align-items: center;
                        }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default Listings;
