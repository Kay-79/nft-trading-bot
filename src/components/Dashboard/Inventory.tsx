import React from "react";
import InventoryCard from "@/components/Card/InventoryCard";
import { InventoryDto } from "@/types/dtos/Inventory.dto";

interface InventoryProps {
    inventories: InventoryDto[];
}

const Inventory: React.FC<InventoryProps> = ({ inventories }) => {
    if (!Array.isArray(inventories)) {
        return <div>No inventories available</div>;
    }

    return (
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
                <InventoryCard key={item.id + (item.tokenId?.toString() ?? "")} item={item} />
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
