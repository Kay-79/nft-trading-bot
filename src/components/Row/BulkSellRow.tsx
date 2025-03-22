import React, { useState } from "react";
import { BulkItemListStorage } from "@/store/reducers/bulkStorageReducer";
import Image from "next/image";
import { useTheme } from "@/config/theme";
import { FaTrash, FaDollarSign } from "react-icons/fa"; // Import FaDollarSign
import { removeItemFromBulk, updateItemInBulk } from "@/store/actions/storageBulk";
import { useDispatch } from "react-redux";

interface BulkSellRowProps {
    bulkSellItem: BulkItemListStorage;
}

const BulkSellRow: React.FC<BulkSellRowProps> = ({ bulkSellItem }) => {
    const dispatch = useDispatch();
    const handleRemoveFromStorage = () => {
        dispatch(removeItemFromBulk(bulkSellItem));
    };
    const [amount, setAmount] = useState(bulkSellItem.quantity);
    const [price, setPrice] = useState(bulkSellItem.price);
    const { theme } = useTheme();

    const handleUpdate = (newAmount: number, newPrice: number) => {
        dispatch(updateItemInBulk({ ...bulkSellItem, quantity: newAmount, price: newPrice }));
    };

    const fetchMarketPrice = async () => {
        const marketPrice = await getMarketPrice(bulkSellItem.inventory.prototype);
        setPrice(marketPrice);
        handleUpdate(amount, marketPrice);
    };

    const getMarketPrice = async (prototype: number) => {
        // Replace with actual API call to fetch market price
        console.log(`Fetching market price for ${prototype}`);
        return 100;
    };

    return (
        <div className="flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-4">
                <div className="flex justify-center my-4 mr-2">
                    {bulkSellItem.inventory && (
                        <Image
                            src={`/images/MOMO/${bulkSellItem.inventory.prototype}.png`}
                            alt="Avatar"
                            width={100}
                            height={100}
                        />
                    )}
                </div>
                <div className="ml-4">
                    <p className="font-semibold">{bulkSellItem.inventory?.prototype}</p>
                    <p className="text-sm text-gray-500">Lv. {bulkSellItem.inventory?.level}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <input
                    type="text"
                    value={amount || ""}
                    onChange={e => {
                        const value = e.target.value;
                        if (!isNaN(Number(value)) || value === "") {
                            const newAmount = Number(value);
                            setAmount(newAmount);
                            handleUpdate(newAmount, price);
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
                            const newPrice = Number(value);
                            setPrice(newPrice);
                            handleUpdate(amount, newPrice);
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
                <FaDollarSign
                    className="text-green-500 cursor-pointer"
                    onClick={fetchMarketPrice}
                    style={{ fontSize: "20px" }}
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
