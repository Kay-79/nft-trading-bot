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

        const response = NextResponse.json({ ok: true }); // ✅ JSON Response OK

        // ✅ Set cookie đúng context App Router
        response.cookies.set("jwt", token, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "lax"
        });

        return response;
    } catch {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
}
