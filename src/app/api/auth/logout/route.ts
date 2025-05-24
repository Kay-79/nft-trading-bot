import { NextResponse } from "next/server";

async function verifyRequest(request: Request): Promise<boolean> {
    const cookie = request.headers.get("cookie");
    if (!cookie) return false;
    const jwtMatch = cookie.match(/jwt=([^;]+)/);
    if (!jwtMatch) return false;
    const jwt = jwtMatch[1];
    return !!jwt;
}

export async function POST(request: Request) {
    const verified = await verifyRequest(request);
    if (!verified) {
        return new NextResponse(JSON.stringify({ ok: false, error: "Unauthorized" }), {
            status: 401
        });
    }
    const res = new NextResponse(JSON.stringify({ ok: true }));
    res.cookies.set("jwt", "", { maxAge: 0, path: "/" });
    return res;
}

export async function GET(request: Request) {
    const verified = await verifyRequest(request);
    if (!verified) {
        return new NextResponse(JSON.stringify({ ok: false, error: "Unauthorized" }), {
            status: 401
        });
    }
    const res = new NextResponse(JSON.stringify({ ok: true }));
    res.cookies.set("jwt", "", { maxAge: 0, path: "/" });
    return res;
}
