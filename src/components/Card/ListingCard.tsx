import React, { useState } from "react";
import Image from "next/image";
// import { FiShoppingCart } from "react-icons/fi";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { shortenAddress, shortenNumber } from "@/utils/shorten";
import ListingDetailModal from "@/components/Modal/ListingDetailModal";
import { getBackgroundColor } from "@/utils/colorUtils";

interface ListingCardProps {
    listing: AuctionDto;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const backgroundColor = getBackgroundColor(listing.prototype || 0);

    const handleClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
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
                            Lv. {listing.level}
                        </span>
                    </span>
                    <div className="text-right">
                        <p className="text-lg font-bold">{listing.lvHashrate}</p>
                        <p className="text-xs text-gray-300">
                            {(listing.hashrate || 0) > 5 ? `Lv. 1 - ${listing.hashrate}` : ""}
                        </p>
                    </div>
                </div>

                {/* Avatar */}
                <div className="flex justify-center my-4">
                    <Image
                        src={`/images/MOMO/${listing.prototype}.png`}
                        alt="Avatar"
                        width={100}
                        height={100}
                        priority
                    />
                </div>

                <p className="text-center text-lg font-semibold">{listing.prototype || 0}</p>

                {/* Name */}
                <p className="text-center text-lg font-semibold">
                    {shortenAddress(listing.auctor || "")}
                </p>

                {/* Price */}
                <div className="flex justify-between items-center mt-4">
                    <span className="text-green-400 font-bold text-lg">
                        {shortenNumber(listing.nowPrice || 0, 9, 3)} USDT
                    </span>
                    {/* <button className="bg-green-500 text-black p-2 rounded-full hover:bg-green-600">
                        <FiShoppingCart size={20} />
                    </button> */}

                </div>

                {/* Item Count */}
                {listing.ids && listing.ids.length > 1 && (
                    <div
                        style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)"
                        }}
                    >
                        {listing.ids.map((id, index) => (
                            <span
                                key={index}
                                style={{
                                    display: "block",
                                    width: "8px",
                                    height: "8px",
                                    backgroundColor: "white",
                                    borderRadius: "50%",
                                    margin: "2px 0"
                                }}
                            ></span>
                        ))}
                    </div>
                )}
            </div>
            {isModalOpen && <ListingDetailModal listing={listing} onClose={handleCloseModal} />}
        </>
    );
};

export default ListingCard;
