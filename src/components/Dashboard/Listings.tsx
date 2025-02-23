import React from "react";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import ListingCard from "@/components/Card/ListingCard";

interface ListingsProps {
    listings: AuctionDto[];
    filter?: {
        minPrice: number;
        minHashrate: number;
        search: string;
        sort: string;
    };
}

const Listings: React.FC<ListingsProps> = ({ listings, filter }) => {
    const defaultFilter = {
        minPrice: 0,
        minHashrate: 0,
        search: "",
        sort: ""
    };

    const appliedFilter = filter || defaultFilter;

    const filteredListings = listings
        .filter(listing => (listing.nowPrice || 0) >= appliedFilter.minPrice)
        .filter(listing => (listing.hashrate || 0) >= appliedFilter.minHashrate)
        .filter(listing => (listing.prototype || 0).toString().includes(appliedFilter.search))
        .sort((a, b) => {
            if (appliedFilter.sort === "price") {
                return (a.nowPrice || 0) - (b.nowPrice || 0);
            } else if (appliedFilter.sort === "hashrate") {
                return (a.hashrate || 0) - (b.hashrate || 0);
            } else if (appliedFilter.sort === "level") {
                return (a.level || 0) - (b.level || 0);
            }
            return 0;
        });

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
            {filteredListings.map(listing => (
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
