import React, { useState } from "react";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import ListingCard from "@/components/Card/ListingCard";
import { shortenNumber } from "@/utils/shorten";
import Pagination from "../Pagination/Pagination";

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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const totalPages = Math.ceil(validListings.length / itemsPerPage);
    const paginatedListings = validListings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
                {paginatedListings.map(listing => (
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
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default Listings;
