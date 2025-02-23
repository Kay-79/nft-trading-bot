import React from "react";
import { useTheme } from "@/config/theme";

const Loading: React.FC = () => {
    const { theme } = useTheme();

    return (
        <div style={{ textAlign: "center", marginTop: "20px", color: theme.textColor }}>
            <div className="spinner" style={{ margin: "0 auto", width: "50px", height: "50px" }}>
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        border: `4px solid ${theme.textColor}`,
                        borderTop: `4px solid ${theme.buttonBackgroundColor}`,
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                    }}
                ></div>
            </div>
            <p>Loading...</p>
            <style jsx>{`
                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
};

export default Loading;
