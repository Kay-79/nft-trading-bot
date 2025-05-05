import { NextResponse } from "next/server";
import axios from "axios";
import { API_MOBOX } from "@/constants/constants";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get("page") || "1";
        const limit = searchParams.get("limit") || "6";
        const category = searchParams.get("category") || "";
        const vType = searchParams.get("vType") || "";
        const sort = searchParams.get("sort") || "-time";
        const pType = searchParams.get("pType") || "";
        const params = { page, limit, category, vType, sort, pType };
        const markets = await axios.get(`${API_MOBOX}/auction/search_v2/BNB`, { params });
        const data = markets.data;
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching markets:", error);
        return NextResponse.json(
            { error: "An error occurred while processing your request." },
            { status: 500 }
        );
    }
}
