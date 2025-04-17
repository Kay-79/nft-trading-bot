import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
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
                disabled={currentPage === 1}
                style={{
                    backgroundColor: "#333",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer"
                }}
            >
                &#9664;
            </button>
            <span style={{ color: "#fff" }}>Current</span>
            <input
                type="number"
                value={currentPage}
                onChange={handlePageInput}
                style={{
                    width: "50px",
                    textAlign: "center",
                    backgroundColor: "#222",
                    color: "#fff",
                    border: "1px solid #555",
                    borderRadius: "5px"
                }}
            />
            <span style={{ color: "#fff" }}>/ {totalPages}</span>
            <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                style={{
                    backgroundColor: "#333",
                    color: "#fff",
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
