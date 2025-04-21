import React, { useEffect, useState } from "react";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import ListingCard from "@/components/Card/ListingCard";
import Pagination from "@/components/Pagination/Pagination";
import axios from "axios";

interface ListingsProps {
    markets: AuctionDto[];
}

const Markets: React.FC<ListingsProps> = ({ markets }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(markets.length / 6) + 1000;
    const [paginatedMarkets, setPaginatedMarkets] = useState<AuctionDto[]>([]);

    useEffect(() => {
        const fetchMarkets = async () => {
            try {
                const response = await axios.get(`/api/markets`, {
                    params: {
                        page: currentPage,
                        limit: 12,
                        category: "",
                        vType: "",
                        sort: "",
                        pType: ""
                    }
                });
                setPaginatedMarkets(response.data);
            } catch (error) {
                console.error("Error fetching markets:", error);
            }
        };

        fetchMarkets();
    }, [currentPage]);
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
                {paginatedMarkets.map(listing => (
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

export default Markets;
