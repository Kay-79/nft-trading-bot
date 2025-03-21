import React, { useState } from "react";
import { InventoryDto } from "@/types/dtos/Inventory.dto";
import Image from "next/image";
import { useTheme } from "@/config/theme";
import { FaTrash } from "react-icons/fa";
import { removeItemFromBulk } from "@/store/actions/storageBulk";
import { useDispatch } from "react-redux";

interface BulkSellRowProps {
    bulkSellItem: InventoryDto;
}

const BulkSellRow: React.FC<BulkSellRowProps> = ({ bulkSellItem }) => {
    const dispatch = useDispatch();
    const handleRemoveFromStorage = () => {
        dispatch(removeItemFromBulk(bulkSellItem));
    };
    const [amount, setAmount] = useState(0);
    const [price, setPrice] = useState(0);
    const { theme } = useTheme();

    return (
        <div className="flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-4">
                <div className="flex justify-center my-4 mr-2">
                    <Image
                        src={`/images/MOMO/${bulkSellItem.prototype}.png`}
                        alt="Avatar"
                        width={100}
                        height={100}
                    />
                </div>
                <div className="ml-4">
                    <p className="font-semibold">{bulkSellItem.prototype}</p>
                    <p className="text-sm text-gray-500">Lv. {bulkSellItem.level}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <input
                    type="text"
                    value={amount || ""}
                    onChange={e => {
                        const value = e.target.value;
                        if (!isNaN(Number(value)) || value === "") {
                            setAmount(Number(value));
                        }
                    }}
                    onWheel={e => e.currentTarget.blur()} // Disable scroll wheel input change
                    placeholder="Amount"
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        border: `1px solid ${theme.textColor}`,
                        backgroundColor: theme.backgroundColor,
                        color: theme.textColor
                    }}
                />
                <input
                    type="text"
                    value={price || ""}
                    onChange={e => {
                        const value = e.target.value;
                        if (!isNaN(Number(value)) || value === "" || /^\d*\.?\d*$/.test(value)) {
                            setPrice(Number(value));
                        }
                    }}
                    onWheel={e => e.currentTarget.blur()}
                    placeholder="Price"
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        border: `1px solid ${theme.textColor}`,
                        backgroundColor: theme.backgroundColor,
                        color: theme.textColor
                    }}
                />
                <FaTrash
                    className="text-red-500 cursor-pointer"
                    onClick={handleRemoveFromStorage}
                    style={{ fontSize: "30px" }}
                />
            </div>
        </div>
    );
};

export default BulkSellRow;
