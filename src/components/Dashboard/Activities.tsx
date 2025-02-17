import React from "react";
import { RecentSold } from "@/types/dtos/RecentSold.dto";

interface ActivitiesProps {
    activities: RecentSold[];
    view: "list" | "card";
}

const Activities: React.FC<ActivitiesProps> = ({ activities, view }) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: view === "list" ? "column" : "row",
                flexWrap: "wrap",
                gap: "20px"
            }}
        >
            {activities.map(activity => (
                <div
                    key={activity.tx}
                    style={{
                        padding: "20px",
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        width: view === "list" ? "100%" : "calc(33.333% - 20px)"
                    }}
                >
                    <h3>{activity.auctor}</h3>
                    <p>Bidder: {activity.bidder}</p>
                    <p>Bid Price: {activity.bidPrice}</p>
                    <p>Transaction: {activity.tx}</p>
                    {/* Add more fields as needed */}
                </div>
            ))}
        </div>
    );
};

export default Activities;
