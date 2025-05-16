import React, { useState } from "react";
import { FaTimes, FaPlusCircle, FaMinusCircle } from "react-icons/fa"; // Import FaMinusCircle
import { useDispatch, useSelector } from "react-redux";
import InventoryDetailModal from "@/components/Modal/InventoryDetailModal";
import { getBackgroundColor } from "@/utils/colorUtils";
import { InventoryDto } from "@/types/dtos/Inventory.dto";
import { MomoType } from "@/enum/enum";
import { shortenAddress } from "@/utils/shorten";
import { addItemToBulk, removeItemFromBulk } from "@/store/actions/storageBulk";
import { BulkItemListStorage } from "@/store/reducers/bulkStorageReducer";
import { Tooltip } from "react-tooltip"; // Update import to use Tooltip
import MomoImage from "../Image/MomoImage";

interface InventoryCardProps {
    item: InventoryDto;
    isListing: boolean;
    amountListing: number;
}

const InventoryCard: React.FC<InventoryCardProps> = ({ item, isListing, amountListing }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch();
    const backgroundColor = getBackgroundColor(item.prototype || 0);

    const bulkSellItems: BulkItemListStorage[] = useSelector(
        (state: { bulkStorage: { bulkSellItems: BulkItemListStorage[] } }) =>
            state.bulkStorage.bulkSellItems
    );
    const isInBulk = bulkSellItems.some(
        (bulkItem: BulkItemListStorage) => bulkItem.inventory?.id === item?.id
    );
    const canAddToBulk =
        bulkSellItems.length < 6 &&
        bulkSellItems.every(
            (bulkItem: BulkItemListStorage) => bulkItem.inventory?.owner === item?.owner
        );

    const handleClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAddToStorage = () => {
        const bulkItem: BulkItemListStorage = {
            id: item.id,
            inventory: item,
            quantity: 1,
            price: 0
        };
        dispatch(addItemToBulk(bulkItem));
    };

    const handleRemoveFromStorage = () => {
        const bulkItem: BulkItemListStorage = {
            id: item.id,
            inventory: item,
            quantity: 1,
            price: 0
        };
        dispatch(removeItemFromBulk(bulkItem));
    };

    return (
        <>
            <div
                className={`text-white p-4 rounded-2xl w-72 shadow-lg relative cursor-pointer ${
                    isInBulk ? "font-bold border-4 border-yellow-500" : ""
                }`}
                style={{
                    backgroundColor: backgroundColor,
                    opacity: isListing ? 0.6 : 1,
                    position: "relative"
                }}
                onClick={handleClick}
            >
                {/* Highlight for listed items */}
                {isListing && (
                    <div
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            backgroundColor: "yellow",
                            color: "black",
                            padding: "5px 10px",
                            borderRadius: "5px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            zIndex: 1
                        }}
                    >
                        {amountListing} Listed
                    </div>
                )}

                {/* Level and Stats */}
                <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center gap-1">
                        <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs">
                            Lv. {item.level}
                        </span>
                    </span>
                    <div className="text-right">
                        <p className="text-lg font-bold">{item.lvHashrate}</p>
                        <p className="text-xs text-gray-300">
                            {(item.hashrate || 0) > 5 ? `Lv. 1 - ${item.hashrate}` : <br />}
                        </p>
                    </div>
                </div>

                {/* Avatar */}
                <div className="flex justify-center my-4">
                    <MomoImage width={100} height={100} prototype={item.prototype || 0} />
                </div>

                {/* Owner */}
                <div className="flex items-center justify-center">
                    <div className="bg-white text-black px-2 py-1 rounded-full text-xs">
                        {shortenAddress(item?.owner || "")}
                    </div>
                </div>

                {/* Amount */}
                {item.type === MomoType.NORMAL ? (
                    <div className="text-center mt-2 flex items-center justify-center">
                        <FaTimes />
                        <p className="text-lg font-semibold">{item.amount}</p>
                    </div>
                ) : (
                    <div className="text-center mt-2 flex items-center justify-center">
                        <FaTimes className="text-sm" />
                        <p className="text-lg font-semibold">1</p>
                    </div>
                )}

                {/* Add to Storage Icon */}
                <div className="absolute bottom-4 right-4">
                    {isInBulk ? (
                        <>
                            <FaMinusCircle
                                className="text-white cursor-pointer"
                                data-tooltip-id="tooltip"
                                data-tooltip-content="Remove from Bulk Sell"
                                onClick={e => {
                                    e.stopPropagation();
                                    handleRemoveFromStorage();
                                }}
                            />
                            <Tooltip id="tooltip" place="top" />
                        </>
                    ) : (
                        <>
                            <FaPlusCircle
                                className={`text-white cursor-pointer ${
                                    !canAddToBulk && "opacity-50 cursor-not-allowed"
                                }`}
                                data-tooltip-id="tooltip"
                                data-tooltip-content={
                                    canAddToBulk ? "Add to Bulk Sell" : "Cannot add to Bulk Sell"
                                }
                                onClick={e => {
                                    e.stopPropagation();
                                    if (canAddToBulk) handleAddToStorage();
                                }}
                                style={{
                                    opacity: !canAddToBulk ? 0.5 : 1,
                                    cursor: !canAddToBulk ? "not-allowed" : "pointer"
                                }}
                            />
                            <Tooltip id="tooltip" place="top" />
                        </>
                    )}
                </div>
            </div>
            {isModalOpen && <InventoryDetailModal item={item} onClose={handleCloseModal} />}
        </>
    );
};

export default InventoryCard;
