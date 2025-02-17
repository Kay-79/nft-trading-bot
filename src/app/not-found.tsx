"use client";

import Link from "next/link";
import { useTheme } from "@/config/theme";

export default function NotFound() {
    const { theme } = useTheme();

    return (
        <div
            className="flex flex-col items-center justify-center h-screen"
            style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
        >
            <h2 className="text-4xl font-bold mb-4" style={{ color: theme.textColor }}>
                404 - Not Found
            </h2>
            <p className="mb-8" style={{ color: theme.textColor }}>
                Oops! The page you are looking for could not be found.
            </p>
            <Link
                href="/"
                className="px-6 py-3 rounded-md"
            >
                Return Home
            </Link>
        </div>
    );
}
