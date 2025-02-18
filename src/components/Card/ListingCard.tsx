import React from "react";
import Image from "next/image";
import { FiShoppingCart } from "react-icons/fi";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { shortenAddress, shortenNumber } from "@/utils/shorten";

interface ListingCardProps {
    listing: AuctionDto;
}

const getBackgroundColor = (prototype: number): string => {
    const firstDigit = prototype.toString()[0];
    switch (firstDigit) {
        case "1":
            return "#474747";
        case "2":
            return "#304119";
        case "3":
            return "#1e2f5c";
        case "4":
            return "#3e1f58";
        case "5":
            return "bg-purple-500";
        case "6":
            return "bg-pink-500";
        default:
            return "bg-gray-500";
    }
};

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
    const backgroundColor = getBackgroundColor(listing.prototype || 0);

    return (
        <div
            className={`text-white p-4 rounded-2xl w-72 shadow-lg relative cursor-pointer`}
            style={{ backgroundColor: backgroundColor }}
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
                    <p className="text-xs text-gray-300">{`Lv. 1 - ${listing.hashrate}`}</p>
                </div>
            </div>

            {/* Avatar */}
            <div className="flex justify-center my-4">
                <Image
                    src={`/images/MOMO/${listing.prototype}.png`}
                    alt="Avatar"
                    width={100}
                    height={100}
                />
            </div>

            {/* Name */}
            <p className="text-center text-lg font-semibold">
                {shortenAddress(listing.auctor || "")}
            </p>

            {/* Price */}
            <div className="flex justify-between items-center mt-4">
                <span className="text-green-400 font-bold text-lg">
                    {shortenNumber(listing.nowPrice || 0, 9, 2)} USDT
                </span>
                <button className="bg-green-500 text-black p-2 rounded-full hover:bg-green-600">
                    <FiShoppingCart size={20} />
                </button>
            </div>
        </div>
    );
};

export default ListingCard;
