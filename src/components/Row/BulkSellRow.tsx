import React, { JSX, useState } from "react";
import { BulkItemListStorage } from "@/store/reducers/bulkStorageReducer";
import Image from "next/image";
import { useTheme } from "@/config/theme";
import { FaTrash, FaDollarSign, FaUsers } from "react-icons/fa";
import { removeItemFromBulk, updateItemInBulk } from "@/store/actions/storageBulk";
import { useDispatch } from "react-redux";
import PrimaryLoadingIcon from "@/components/Button/PrimaryLoadingIcon";
import axios from "axios";
import { toast } from "react-toastify";
import { shortenNumber } from "@/utils/shorten";
import { getImgUrl } from "@/utils/image/getImgUrl";
import { getErrorMessage } from "@/utils/getErrorMessage";
import HoverOnShowActivitiesDetail from "../Hover/HoverOnShowActivitiesDetail";
import { getBackgroundColor } from "@/utils/colorUtils";

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

    const handleUpdateBulkItem = (newAmount: number, newPrice: number) => {
        dispatch(updateItemInBulk({ ...bulkSellItem, quantity: newAmount, price: newPrice }));
    };

    const fetchPredictPrice = async () => {
        setLoadingPredict(true);
        try {
            const apiEndpoint = bulkSellItem.inventory.tokenId
                ? "/api/predict721"
                : "/api/predict1155";
            const response = await axios.post(apiEndpoint, {
                hashrate: bulkSellItem.inventory.hashrate ?? 0,
                lvHashrate: bulkSellItem.inventory.lvHashrate ?? 0,
                prototype: bulkSellItem.inventory.prototype ?? 0,
                level: bulkSellItem.inventory.level ?? 0,
                ids: [],
                amounts: []
            });
            setPrice(shortenNumber(response.data.prediction, 0, 3));
            handleUpdateBulkItem(amount, response.data.prediction);
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setLoadingPredict(false);
        }
    };

    const token = {
        prototype: bulkSellItem.inventory.prototype,
        level: bulkSellItem.inventory.level,
        tokenId: bulkSellItem.inventory.tokenId
    };
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);

    const handleMouseEnter = (index: number) => {
        setHoveredItem(index);
    };
    const handleMouseLeave = () => {
        setHoveredItem(null);
    };

    const renderImages = () => {
        const images: JSX.Element[] = [];
        const renderIcon = () => {
            if (bulkSellItem.quantity > 1) {
                return (
                    <div
                        style={{
                            position: "absolute",
                            top: "-10px",
                            right: "15px",
                            width: "15px",
                            height: "15px",
                            borderRadius: "50%",
                            backgroundColor: "black",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 2
                        }}
                    >
                        <FaUsers
                            style={{
                                color: "white",
                                fontSize: "12px"
                            }}
                        />
                    </div>
                );
            }
            return null;
        };

        if (bulkSellItem.inventory.prototype > 0) {
            [bulkSellItem.inventory.prototype].forEach((id, index) => {
                if (index > 0 && index % 6 === 0) {
                    images.push(<br key={`br-${index}`} />);
                }
                images.push(
                    <div
                        key={index}
                        style={{
                            position: "relative",
                            borderRadius: "50%",
                            border: `3px solid ${getBackgroundColor(Number(id))}`,
                            width: "50px",
                            height: "50px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                    >
                        {renderIcon()}
                        <span
                            style={{
                                position: "absolute",
                                top: "0",
                                right: "0",
                                transform: "translate(50%, -50%)",
                                backgroundColor: getBackgroundColor(3),
                                color: "#fff",
                                borderRadius: "50%",
                                padding: "2px 5px",
                                fontSize: "8px",
                                zIndex: 1
                            }}
                        >
                            {bulkSellItem.quantity ?? 0}
                        </span>
                        <Image
                            src={getImgUrl(Number(id))}
                            alt={`MOMO ${id}`}
                            width={40}
                            height={40}
                            priority
                        />
                        {hoveredItem === index && (
                            <div
                                style={{ position: "absolute", top: "0", left: "100%", zIndex: 10 }}
                            >
                                <HoverOnShowActivitiesDetail
                                    item={{
                                        prototype: Number(id),
                                        level: 1,
                                        tokenId: Number(id)
                                    }}
                                />
                            </div>
                        )}
                    </div>
                );
            });
        } else if (bulkSellItem.inventory.tokenId) {
            <div
                key={bulkSellItem.id}
                style={{
                    position: "relative",
                    borderRadius: "50%",
                    border: `3px solid ${getBackgroundColor(bulkSellItem.inventory.prototype)}`,
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
                onMouseEnter={() => handleMouseEnter(bulkSellItem.inventory.prototype)}
                onMouseLeave={handleMouseLeave}
            >
                {renderIcon()}
                <Image
                    src={getImgUrl(bulkSellItem.inventory.prototype)}
                    alt={`MOMO ${bulkSellItem.inventory.prototype}`}
                    width={40}
                    height={40}
                    priority
                />
                {hoveredItem === bulkSellItem.inventory.prototype && (
                    <div style={{ position: "absolute", top: "0", left: "100%", zIndex: 10 }}>
                        <HoverOnShowActivitiesDetail item={token} />
                    </div>
                )}
            </div>;
        }
        return images;
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div style={{ display: "flex", gap: "1px", flex: 3, flexWrap: "wrap" }}>
                    {renderImages()}
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
                            handleUpdateBulkItem(newAmount, price);
                        }
                    }}
                    onWheel={e => e.currentTarget.blur()}
                    placeholder={`Amount: x${bulkSellItem.inventory.amount}`}
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        border: `1px solid ${theme.textColor}`,
                        backgroundColor: theme.backgroundColor,
                        color: theme.textColor,
                        cursor: (bulkSellItem.inventory.tokenId || 0) > 0 ? "not-allowed" : "text"
                    }}
                    disabled={(bulkSellItem.inventory.tokenId || 0) > 0}
                />
                <input
                    type="text"
                    value={price || ""}
                    onChange={e => {
                        const value = e.target.value;
                        if (!isNaN(Number(value)) || value === "" || /^\d*\.?\d*$/.test(value)) {
                            const newPrice = Number(value);
                            setPrice(newPrice);
                            handleUpdateBulkItem(amount, newPrice);
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
                    <PrimaryLoadingIcon onClick={fetchPredictPrice} loading={loadingPredict}>
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
