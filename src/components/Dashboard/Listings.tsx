import React from "react";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import ListingCard from "@/components/Card/ListingCard";

interface ListingsProps {
    listings: AuctionDto[];
}

const Listings: React.FC<ListingsProps> = ({ listings }) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: "20px",
                justifyContent: "center"
            }}
        >
            {listings.map(listing => (
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
    );
};

export default Listings;
