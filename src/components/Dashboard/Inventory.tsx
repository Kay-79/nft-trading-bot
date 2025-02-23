import React from "react";
import { Momo721 } from "@/types/dtos/Momo721";
import InventoryCard from "@/components/Card/InventoryCard";

interface InventoryProps {
    inventory: Momo721[];
    view: "list" | "card";
}

const Inventory: React.FC<InventoryProps> = ({ inventory, view }) => {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: view === "list" ? "1fr" : "repeat(3, 1fr)",
                gap: "20px",
                justifyContent: "center"
            }}
        >
            {inventory.map(item => (
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
