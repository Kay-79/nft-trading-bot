import React from "react";
import InventoryCard from "@/components/Card/InventoryCard";
import { InventoryDto } from "@/types/dtos/Inventory.dto";

interface InventoryProps {
    inventories: InventoryDto[];
    view: "list" | "card";
}

const Inventories: React.FC<InventoryProps> = ({ inventories, view }) => {
    if (!Array.isArray(inventories)) {
        return <div>No inventories available</div>;
    }

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: view === "list" ? "1fr" : "repeat(3, 1fr)",
                gap: "20px",
                justifyContent: "center"
            }}
        >
            {inventories.map(item => (
                <InventoryCard
                    key={(item.prototype?.toString() ?? "") + (item.tokenId?.toString() ?? "")}
                    item={item}
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
    );
};

export default Inventories;
