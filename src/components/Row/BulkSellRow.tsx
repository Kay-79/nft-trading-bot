import React, { useState } from "react";
import { BulkItemListStorage } from "@/store/reducers/bulkStorageReducer";
import Image from "next/image";
import { useTheme } from "@/config/theme";
import { FaTrash, FaDollarSign } from "react-icons/fa"; // Import FaDollarSign
import { removeItemFromBulk, updateItemInBulk } from "@/store/actions/storageBulk";
import { useDispatch } from "react-redux";
import PrimaryLoadingIcon from "@/components/Button/PrimaryLoadingIcon"; // Import PrimaryLoadingIcon
import axios from "axios";
import { toast } from "react-toastify";

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
    const [loadingPredict, setLoadingPredict] = useState<boolean>(false);

    const handleUpdate = (newAmount: number, newPrice: number) => {
        dispatch(updateItemInBulk({ ...bulkSellItem, quantity: newAmount, price: newPrice }));
    };

    const fetchMarketPrice = async () => {
        setLoadingPredict(true);
        try {
            const response = await axios.post("/api/predict1155", {
                hashrate: bulkSellItem.inventory.hashrate ?? 0,
                lvHashrate: bulkSellItem.inventory.lvHashrate ?? 0,
                prototype: bulkSellItem.inventory.prototype ?? 0,
                level: bulkSellItem.inventory.level ?? 0
            });
            setPrice(response.data.prediction);
            handleUpdate(amount, response.data.prediction);
        } catch (error) {
            console.error(error);
            toast.error("Prediction failed!");
        } finally {
            setLoadingPredict(false);
        }
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
                {!price && (
                    <PrimaryLoadingIcon onClick={fetchMarketPrice} loading={loadingPredict}>
                        <FaDollarSign
                            className="text-green-500 cursor-pointer"
                            style={{ fontSize: "15px" }}
                        />
                    </PrimaryLoadingIcon>
                )}
                <FaTrash
                    className="text-red-500 cursor-pointer"
                    onClick={handleRemoveFromStorage}
                    style={{ fontSize: "50px" }}
                />
            </div>
        </div>
    );
};

export default BulkSellRow;
