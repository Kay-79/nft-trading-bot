import React, { useEffect, useState } from "react";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import ListingCard from "@/components/Card/ListingCard";
import Pagination from "@/components/Pagination/Pagination";
import axios from "axios";
import { FilterParams } from "./FilterPanel";

interface ListingsProps {
    filterParams: FilterParams;
}

const Listings: React.FC<ListingsProps> = ({ filterParams }) => {
    const [listings, setListings] = useState<AuctionDto[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalListings, setTotalListings] = useState(0);
    const itemsPerPage = 12;

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await axios.get(`/api/listings`, {
                    params: {
                        page: currentPage,
                        limit: itemsPerPage,
                        vType: filterParams.vType,
                        sort: filterParams.sort
                    }
                });
                console.log("Listings response:", response);
                setListings(response.data.list);
                setTotalListings(response.data.total);
            } catch (error) {
                console.error("Error fetching Listings:", error);
            }
        };

        fetchListings();
    }, [currentPage, filterParams]);

    const canAddToCart = true;

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: "20px",
                    justifyContent: "center"
                }}
            >
                {listings.length === 0 ? (
                    <div style={{ textAlign: "center", width: "100%" }}>
                        <h2>No Listings Found</h2>
                        <p>Please adjust your filters or try again later.</p>
                    </div>
                ) : (
                    listings.map(listing => (
                        <ListingCard
                            key={listing.id}
                            listing={listing}
                            canAddToCart={canAddToCart}
                        />
                    ))
                )}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalListings / itemsPerPage)}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default Listings;
