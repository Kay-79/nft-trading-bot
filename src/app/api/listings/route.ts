import { NextResponse } from "next/server";
import { connectMongo } from "@/utils/connectMongo";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get("page") || "1";
        const limit = searchParams.get("limit") || "12";
        const vType = searchParams.get("vType") || "";
        const sort = searchParams.get("sort") || "-time";
        const minPrice = searchParams.get("minPrice") || "";
        const maxPrice = searchParams.get("maxPrice") || "";
        const minHashrate = searchParams.get("minHashrate") || "";
        const maxHashrate = searchParams.get("maxHashrate") || "";
        const search = searchParams.get("search") || "";
        const db = await connectMongo();
        const skip = (parseInt(page) - 1) * parseInt(limit);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};

        if (vType) {
            const vTypeNum = Number(vType);
            if (!isNaN(vTypeNum)) {
                query.prototype = {
                    $gte: vTypeNum * 10000,
                    $lt: (vTypeNum + 1) * 10000
                };
            }
        }
        if (minPrice || maxPrice) {
            query.nowPrice = {};
            if (minPrice) query.nowPrice.$gte = Number(minPrice) * 10 ** 9;
            if (maxPrice) query.nowPrice.$lte = Number(maxPrice) * 10 ** 9;
        }
        if (minHashrate || maxHashrate) {
            query.hashrate = {};
            if (minHashrate) query.hashrate.$gte = Number(minHashrate);
            if (maxHashrate) query.hashrate.$lte = Number(maxHashrate);
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        // Build sort object
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sortObj: any = {};
        if (sort) {
            const direction = sort.startsWith("-") ? -1 : 1;
            let field = sort.replace(/^-/, "");
            if (field === "price") field = "nowPrice";
            else if (field === "time") field = "upTime";
            sortObj[field] = direction;
        }

        const listings = await db
            .collection("listings")
            .find(query)
            .sort(sortObj)
            .skip(skip)
            .limit(parseInt(limit))
            .toArray();
        const total = await db.collection("listings").countDocuments(query);
        return NextResponse.json({
            list: listings,
            page: parseInt(page),
            limit: parseInt(limit),
            total: total
        });
    } catch (error) {
        return NextResponse.json({ error });
    }
}
