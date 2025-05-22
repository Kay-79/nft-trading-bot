import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
    const token = req.cookies.get("jwt")?.value;

    if (!token) {
        return NextResponse.json({});
    }

    try {
        const payload = await verifyJwt(token);
        if (!payload) {
            return NextResponse.json({});
        }
        return NextResponse.json({ address: payload.address });
    } catch {
        return NextResponse.json({});
    }
}
