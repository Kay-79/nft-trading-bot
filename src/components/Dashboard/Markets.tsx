import React, { useEffect, useState } from "react";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import ListingCard from "@/components/Card/ListingCard";
import Pagination from "@/components/Pagination/Pagination";
import axios from "axios";
import { FilterParams } from "./FilterPanel";

interface ListingsProps {
    markets: AuctionDto[];
    filterParams: FilterParams;
}

const Markets: React.FC<ListingsProps> = ({ filterParams }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalMarkets, setTotalMarkets] = useState(0);
    const itemsPerPage = 12;
    const totalPages = Math.ceil(totalMarkets / itemsPerPage);
    const [paginatedMarkets, setPaginatedMarkets] = useState<AuctionDto[]>([]);

    useEffect(() => {
        const fetchMarkets = async () => {
            try {
                const response = await axios.get(`/api/markets`, {
                    params: {
                        page: currentPage,
                        limit: itemsPerPage,
                        category: "",
                        vType: filterParams.vType,
                        sort: "",
                        pType: ""
                    }
                });
                setPaginatedMarkets(response.data.list);
                setTotalMarkets(response.data.total);
            } catch (error) {
                console.error("Error fetching markets:", error);
            }
        };

        fetchMarkets();
    }, [currentPage, filterParams.vType]);

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
                {(paginatedMarkets || []).map(listing => (
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
