import React, { JSX, useState } from "react";
import Image from "next/image";
import { RecentSold } from "@/types/dtos/RecentSold.dto";
import { shortenAddress, shortenNumber } from "@/utils/shorten";
import { FaExternalLinkAlt } from "react-icons/fa";
import { EXPLORER_URL } from "@/constants/constants";
import { getBackgroundColor } from "@/utils/colorUtils";
import HoverOnShowActivitiesDetail from "@/components/Hover/HoverOnShowActivitiesDetail";

interface ActivityRowProps {
    activity: RecentSold;
}

const ActivityRow: React.FC<ActivityRowProps> = ({ activity }) => {
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);

    const handleMouseEnter = (index: number) => {
        setHoveredItem(index);
    };

    const handleMouseLeave = () => {
        setHoveredItem(null);
    };

    const renderImages = () => {
        const images: JSX.Element[] = [];
        if (activity.ids && activity.ids.length > 0) {
            activity.ids.forEach((id, index) => {
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
                            {activity.amounts?.[index] ?? 0}
                        </span>
                        <Image
                            src={`/images/MOMO/${id}.png`}
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
        } else if (activity.tokens && activity.tokens.length > 0) {
            activity.tokens.forEach((token, index) => {
                if (index > 0 && index % 6 === 0) {
                    images.push(<br key={`br-${index}`} />);
                }
                images.push(
                    <div
                        key={index}
                        style={{
                            position: "relative",
                            borderRadius: "50%",
                            border: `3px solid ${getBackgroundColor(Number(token.prototype))}`,
                            width: "50px",
                            height: "50px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Image
                            src={`/images/MOMO/${token.prototype}.png`}
                            alt={`MOMO ${token.prototype}`}
                            width={40}
                            height={40}
                            priority
                        />
                        {hoveredItem === index && (
                            <div
                                style={{ position: "absolute", top: "0", left: "100%", zIndex: 10 }}
                            >
                                <HoverOnShowActivitiesDetail item={token} />
                            </div>
                        )}
                    </div>
                );
            });
        }
        return images;
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
                borderBottom: "1px solid #ccc",
                minWidth: "400px"
            }}
        >
            <div style={{ display: "flex", gap: "1px", flex: 3, flexWrap: "wrap" }}>
                {renderImages()}
            </div>
            <span style={{ flex: 2 }}>{shortenAddress(activity.bidder || "")}</span>
            <span style={{ flex: 2 }}>{shortenAddress(activity.auctor || "")}</span>
            <span style={{ flex: 2 }}>{shortenNumber(activity.bidPrice || 0, 9, 3)} USDT</span>
            <span style={{ display: "flex", flex: 2 }}>
                {new Date((activity.crtime || 0) * 1000).toLocaleString()}
                <a
                    href={`${EXPLORER_URL}/tx/${activity.tx}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginLeft: "5px" }}
                >
                    <FaExternalLinkAlt />
                </a>
            </span>
        </div>
    );
};

export default ActivityRow;
