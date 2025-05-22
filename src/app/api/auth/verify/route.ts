import { NextResponse } from "next/server";
import { SiweMessage } from "siwe";
import { signJwt } from "@/app/lib/auth";

export async function POST(req: Request) {
    const { message, signature } = await req.json();
    const siwe = new SiweMessage(message);

    try {
        const result = await siwe.verify({ signature });
        const address = result.data.address;

        const token = await signJwt({ address });

        const res = new NextResponse(JSON.stringify({ ok: true }));
        res.cookies.set("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 3600 * 72
        });

        return res;
    } catch {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
}
