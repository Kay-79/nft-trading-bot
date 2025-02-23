import React from "react";
import { Momo721 } from "@/types/dtos/Momo721";
import InventoryCard from "@/components/Card/InventoryCard";

interface InventoryProps {
    inventory: Momo721[];
    view: "list" | "card";
    filter?: {
        minPrice: number;
        minHashrate: number;
        search: string;
        sort: string;
    };
}

const Inventory: React.FC<InventoryProps> = ({ inventory, view, filter }) => {
    const defaultFilter = {
        minPrice: 0,
        minHashrate: 0,
        search: "",
        sort: ""
    };

    const appliedFilter = filter || defaultFilter;

    const filteredInventory = inventory
        .filter(item => (item.hashrate ?? 0) >= appliedFilter.minHashrate)
        .filter(item => item.prototype?.toString().includes(appliedFilter.search))
        .sort((a, b) => {
            if (appliedFilter.sort === "price") {
                return (a.hashrate ?? 0) - (b.hashrate ?? 0); // Assuming price is related to hashrate
            } else if (appliedFilter.sort === "hashrate") {
                return (a.hashrate ?? 0) - (b.hashrate ?? 0);
            } else if (appliedFilter.sort === "level") {
                return (a.level ?? 0) - (b.level ?? 0);
            }
            return 0;
        });

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: view === "list" ? "1fr" : "repeat(3, 1fr)",
                gap: "20px",
                justifyContent: "center"
            }}
        >
            {filteredInventory.map(item => (
                <InventoryCard key={item.tokenId} item={item} />
            ))}
            <style jsx>{`
                @media (max-width: 768px) {
                    div {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default Inventory;
