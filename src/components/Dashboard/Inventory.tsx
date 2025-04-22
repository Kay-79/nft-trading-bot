import React from "react";
import InventoryCard from "@/components/Card/InventoryCard";
import { InventoryDto } from "@/types/dtos/Inventory.dto";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { useAccount } from "wagmi";
import { CHANGER } from "@/constants/constants";

interface InventoryProps {
    inventories: InventoryDto[];
    listings: AuctionDto[];
}

const Inventory: React.FC<InventoryProps> = ({ inventories, listings }) => {
    const { address } = useAccount();
    if (
        !Array.isArray(inventories) ||
        address?.toLocaleLowerCase() !== CHANGER.toLocaleLowerCase()
    ) {
        return <div>No inventories available</div>;
    }

    const totalInventories = inventories.reduce(
        (sum, inventory) => sum + (inventory.amount || 0),
        0
    );

    const totalHashes = inventories.reduce(
        (sum, inventory) => sum + Math.floor(inventory.prototype / 10000) * (inventory.amount || 0),
        0
    );

    const isListingOfItem = (item: InventoryDto): boolean => {
        return listings.some(listing => listing.prototype === item.prototype);
    };

    const amountListingOfItem = (item: InventoryDto): number => {
        let amount = 0;
        listings.forEach(listing => {
            if (listing.prototype === item.prototype) {
                amount += 1;
            }
        });
        return amount;
    };

    return (
        <div>
            <div style={{ textAlign: "right", marginBottom: "20px" }}>
                <p style={{ margin: 0 }}>Total Momos: {totalInventories}</p>
                <p style={{ margin: 0 }}>Total hashes: {totalHashes}</p>
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
                {inventories.map(item => (
                    <InventoryCard
                        key={item.id + (item.tokenId?.toString() ?? "")}
                        item={item}
                        isListing={isListingOfItem(item)}
                        amountListing={amountListingOfItem(item)}
                    />
                ))}
                <style jsx>{`
                    @media (max-width: 768px) {
                        div {
                            grid-template-columns: 1fr;
                        }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default Inventory;
