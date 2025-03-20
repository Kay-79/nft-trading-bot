import React, { useState } from "react";
import Image from "next/image";
import { FaTimes, FaPlusCircle, FaMinusCircle } from "react-icons/fa"; // Import FaMinusCircle
import { useDispatch, useSelector } from "react-redux";
import InventoryDetailModal from "@/components/Modal/InventoryDetailModal";
import { getBackgroundColor } from "@/utils/colorUtils";
import { InventoryDto } from "@/types/dtos/Inventory.dto";
import { MomoType } from "@/enum/enum";
import { shortenAddress } from "@/utils/shorten";
import { addItemToBulk, removeItemFromBulk } from "@/store/actions/storageBulk"; // Import the actions

interface InventoryCardProps {
    item: InventoryDto;
}

const InventoryCard: React.FC<InventoryCardProps> = ({ item }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch(); // Initialize dispatch
    const backgroundColor = getBackgroundColor(item.prototype || 0);

    const bulkItems = useSelector((state: { bulkStorage: { items: InventoryDto[] } }) => state.bulkStorage.items); // Access bulk storage items
    const isInBulk = bulkItems.some((bulkItem: InventoryDto) => bulkItem.id === item.id); // Check if item is in bulk

    const handleClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAddToStorage = () => {
        dispatch(addItemToBulk(item));
    };

    const handleRemoveFromStorage = () => {
        dispatch(removeItemFromBulk(item));
    };

    return (
        <>
            <div
                className={`text-white p-4 rounded-2xl w-72 shadow-lg relative cursor-pointer`}
                style={{ backgroundColor: backgroundColor }}
                onClick={handleClick}
            >
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
                            {(item.hashrate || 0) > 5 ? `Lv. 1 - ${item.hashrate}` : ""}
                        </p>
                    </div>
                </div>

                {/* Avatar */}
                <div className="flex justify-center my-4">
                    <Image
                        src={`/images/MOMO/${item.prototype}.png`}
                        alt="Avatar"
                        width={100}
                        height={100}
                    />
                </div>

                {/* Owner */}
                <div className="flex items-center justify-center">
                    <div className="bg-white text-black px-2 py-1 rounded-full text-xs">
                        {shortenAddress(item.owner || "")}
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
                        <FaMinusCircle
                            className="text-white cursor-pointer"
                            onClick={e => {
                                e.stopPropagation(); // Prevent triggering the card click
                                handleRemoveFromStorage();
                            }}
                        />
                    ) : (
                        <FaPlusCircle
                            className="text-white cursor-pointer"
                            onClick={e => {
                                e.stopPropagation(); // Prevent triggering the card click
                                handleAddToStorage();
                            }}
                        />
                    )}
                </div>
            </div>
            {isModalOpen && <InventoryDetailModal item={item} onClose={handleCloseModal} />}
        </>
    );
};

export default InventoryCard;
