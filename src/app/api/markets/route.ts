import { NextResponse } from "next/server";
import axios from "axios";
import { API_MOBOX } from "@/constants/constants";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get("page") || "1";
        const limit = searchParams.get("limit") || "12";
        const vType = searchParams.get("vType") || "";
        const sort = searchParams.get("sort") || "-time";
        const sortOrder = searchParams.get("sortOrder") || "desc";
        const minPrice = searchParams.get("minPrice") || "";
        const maxPrice = searchParams.get("maxPrice") || "";
        const minHashrate = searchParams.get("minHashrate") || "";
        const maxHashrate = searchParams.get("maxHashrate") || "";
        const search = searchParams.get("search") || "";

        const params = {
            page,
            limit,
            vType,
            sort: `${sortOrder === "asc" ? "" : "-"}${sort}`,
            minPrice,
            maxPrice,
            minHashrate,
            maxHashrate,
            search
        };

        const markets = await axios.get(`${API_MOBOX}/auction/search_v2/BNB`, { params });
        return NextResponse.json(markets.data);
    } catch (error) {
        console.error("Error fetching markets:", error);
        return NextResponse.json(
            { error: "An error occurred while processing your request." },
            { status: 500 }
        );
    }
}
