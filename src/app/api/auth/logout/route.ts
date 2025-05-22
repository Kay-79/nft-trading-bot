import { NextResponse } from "next/server";

export async function POST() {
    const res = new NextResponse(JSON.stringify({ ok: true }));
    res.cookies.set("jwt", "", { maxAge: 0, path: "/" });
    return res;
}

export async function GET() {
    const res = new NextResponse(JSON.stringify({ ok: true }));
    res.cookies.set("jwt", "", { maxAge: 0, path: "/" });
    return res;
}
