import { NextResponse } from "next/server";

function handleApiError(error: Error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), {
        status: 500,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export async function GET() {
    try {
        return NextResponse.json({ message: "Success" });
    } catch (error: unknown) {
        return handleApiError(error as Error);
    }
}

export async function HEAD() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Cross-Origin-Opener-Policy": "same-origin"
        }
    });
}
