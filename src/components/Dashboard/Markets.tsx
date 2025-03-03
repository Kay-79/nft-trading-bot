import React from "react";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import ListingCard from "@/components/Card/ListingCard";
import { shortenNumber } from "@/utils/shorten";

interface ListingsProps {
    markets: AuctionDto[];
}

const Markets: React.FC<ListingsProps> = ({ markets }) => {
    const totalPrice = shortenNumber(
        markets.reduce((sum, listing) => sum + (listing.nowPrice || 0), 0),
        9,
        3
    );
    const totalListings = markets.length;

    return (
        <div>
            <div style={{ textAlign: "right", marginBottom: "20px" }}>
                <p style={{ margin: 0 }}>Total Price: {totalPrice.toFixed(2)} USDT</p>
                <p style={{ margin: 0 }}>Total Markets: {totalListings}</p>
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
                {markets.map(listing => (
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

export default Markets;
