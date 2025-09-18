import React from "react";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { shortenAddress, shortenNumber } from "@/utils/shorten";
import { getBackgroundColor } from "@/utils/colorUtils";
import PrototypeImage from "@/components/Image/PrototypeImage";

interface CartRowProps {
    listing: AuctionDto;
    onRemove: (listing: AuctionDto) => void;
}

const CartRow: React.FC<CartRowProps> = ({ listing, onRemove }) => {
    const backgroundColor = getBackgroundColor(listing.prototype || 0);

    return (
        <div className="flex items-center p-4 mb-2 rounded-lg" style={{ backgroundColor }}>
            <div className="flex-shrink-0 mr-4">
                <PrototypeImage width={60} height={60} prototype={listing.prototype || 0} />
            </div>

            <div className="flex-grow">
                <div className="flex items-center gap-2">
                    <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs">
                        Lv. {listing.level}
                    </span>
                    <span className="text-white font-semibold">#{listing.prototype || 0}</span>
                </div>

                <div className="flex items-center gap-4 mt-2">
                    <div className="text-white">
                        <p className="text-sm font-bold">{listing.lvHashrate}</p>
                        <p className="text-xs text-gray-300">
                            {(listing.hashrate || 0) > 5 ? `Lv. 1 - ${listing.hashrate}` : ""}
                        </p>
                    </div>
                    <div className="text-white">
                        <p className="text-sm">Seller:</p>
                        <p className="text-sm">{shortenAddress(listing.auctor || "")}</p>
                    </div>
                </div>
            </div>

            <div className="flex-shrink-0 flex flex-col items-end gap-2">
                <span className="text-green-400 font-bold">
                    {shortenNumber(listing.nowPrice || 0, 9, 3)} USDT
                </span>
                <button
                    onClick={() => onRemove(listing)}
                    className="text-red-400 hover:text-red-500 text-sm font-semibold"
                >
                    Remove
                </button>
            </div>
        </div>
    );
};

export default React.memo(CartRow);
