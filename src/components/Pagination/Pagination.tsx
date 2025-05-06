import { useTheme } from "@/config/theme";
import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const { theme } = useTheme();

    const handleNextPage = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const page = Math.max(1, Math.min(totalPages, Number(e.target.value) || 1));
        onPageChange(page);
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px",
                gap: "10px"
            }}
        >
            <button
                onClick={handlePreviousPage}
                disabled={currentPage === totalPages}
                style={{
                    backgroundColor: theme.backgroundColor,
                    color: theme.textColor,
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer"
                }}
            >
                &#9664;
            </button>
            <span style={{ color: theme.textColor }}>Current</span>
            <input
                type="number"
                value={currentPage}
                onChange={handlePageInput}
                style={{
                    width: "55px",
                    textAlign: "center",
                    backgroundColor: theme.backgroundColor,
                    color: theme.textColor,
                    border: "1px solid #555",
                    borderRadius: "5px"
                }}
            />
            <span style={{ color: theme.textColor }}>/ {totalPages}</span>
            <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                style={{
                    backgroundColor: theme.backgroundColor,
                    color: theme.textColor,
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer"
                }}
            >
                &#9654;
            </button>
        </div>
    );
};

export default Pagination;
