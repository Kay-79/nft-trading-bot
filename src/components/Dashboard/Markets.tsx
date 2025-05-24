import React, { useEffect, useState } from "react";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import ListingCard from "@/components/Card/ListingCard";
import Pagination from "@/components/Pagination/Pagination";
import axios from "axios";
import { FilterParams } from "./FilterPanel";

interface MarketsProps {
    filterParams: FilterParams;
}

const Markets: React.FC<MarketsProps> = ({ filterParams }) => {
    const [markets, setMarkets] = useState<AuctionDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalMarkets, setTotalMarkets] = useState(0);
    const itemsPerPage = 12;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const fetchMarkets = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/markets`, {
                    params: {
                        page: currentPage,
                        limit: itemsPerPage,
                        vType: filterParams.vType,
                        sort: filterParams.sort
                    }
                });
                setMarkets(response.data.list);
                setTotalMarkets(response.data.total);
            } catch (error) {
                console.error("Error fetching markets:", error);
            }
            setLoading(false);
        };

        fetchMarkets();
    }, [currentPage, filterParams]);

    const canAddToCart = true;

    if (!mounted) {
        return null;
    }

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
                {markets.length === 0 && !loading ? (
                    <div style={{ textAlign: "center", width: "100%" }}>
                        <h2>No Listings Found {`${loading}`}</h2>
                        <p>Please adjust your filters or try again later.</p>
                    </div>
                ) : (
                    markets.map(listing => (
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
                totalPages={Math.ceil(totalMarkets / itemsPerPage)}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default Markets;
