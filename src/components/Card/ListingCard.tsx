import React, { useState, useCallback, useEffect } from "react";
import { AuctionDto } from "@/types/dtos/Auction.dto";
import { shortenAddress, shortenNumber } from "@/utils/shorten";
import ListingDetailModal from "@/components/Modal/ListingDetailModal";
import { getBackgroundColor } from "@/utils/colorUtils";
import axios from "axios";
import PrototypeImage from "@/components/Image/PrototypeImage";
import AddToCartIcon from "@/components/Cart/AddToCartIcon";

interface ListingCardProps {
    listing: AuctionDto;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const backgroundColor = getBackgroundColor(listing.prototype || 0);
    const [gems, setGems] = useState<number[]>([]);

    useEffect(() => {
        async function fetchGems() {
            if ((listing.tokenId ?? 0) > 0) {
                const response = await axios.get("/api/gem/gemEquipment", {
                    params: {
                        tokenId: listing.tokenId
                    }
                });
                setGems(response.data);
            } else {
                setGems([]);
            }
        }
        fetchGems();
    }, [listing]);
    const handleClick = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const handleAddToCart = (listing: AuctionDto, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        // Có thể thêm logic thông báo hoặc xử lý khác nếu cần
    };

    return (
        <>
            <div
                className={`text-white p-4 rounded-2xl w-72 shadow-lg relative cursor-pointer`}
                style={{ backgroundColor: backgroundColor }}
                onClick={handleClick}
            >
                <AddToCartIcon listing={listing} onAddToCart={handleAddToCart} />
                <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center gap-1">
                        <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs">
                            Lv. {listing.level}
                        </span>
                    </span>
                    <div className="text-right">
                        <p className="text-lg font-bold">{listing.lvHashrate}</p>
                        <p className="text-xs text-gray-300">
                            {(listing.hashrate || 0) > 5 ? `Lv. 1 - ${listing.hashrate}` : <br />}
                        </p>
                    </div>
                </div>

                {/* Avatar */}
                <div className="flex justify-center my-4">
                    <PrototypeImage width={100} height={100} prototype={listing.prototype || 0} />
                </div>

                <p className="text-center text-lg font-semibold">{listing.prototype || 0}</p>

                <p className="text-center text-lg font-semibold">
                    {shortenAddress(listing.auctor || "")}
                </p>

                <div className="flex justify-between items-center mt-4">
                    <span className="text-green-400 font-bold text-lg">
                        {shortenNumber(listing.nowPrice || 0, 9, 3)} USDT
                    </span>
                </div>

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
            {isModalOpen && (
                <ListingDetailModal listing={listing} gems={gems} onClose={handleCloseModal} />
            )}
        </>
    );
};

export default React.memo(ListingCard);
