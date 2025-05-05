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
    const [currentPage, setCurrentPage] = useState(1);
    const [totalMarkets, setTotalMarkets] = useState(0);
    const itemsPerPage = 12;

    useEffect(() => {
        const fetchMarkets = async () => {
            try {
                const response = await axios.get(`/api/markets`, {
                    params: {
                        page: currentPage,
                        limit: itemsPerPage,
                        vType: filterParams.vType
                    }
                });
                setMarkets(response.data.list);
                setTotalMarkets(response.data.total);
            } catch (error) {
                console.error("Error fetching markets:", error);
            }
        };

        fetchMarkets();
    }, [currentPage, filterParams]);

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
                {markets.map(listing => (
                    <ListingCard key={listing.id} listing={listing} />
                ))}
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
