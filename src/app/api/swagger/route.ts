import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
    const filePath = path.join(process.cwd(), "swagger.yaml");
    const yaml = fs.readFileSync(filePath, "utf8");
    return new NextResponse(yaml, {
        status: 200,
        headers: { "Content-Type": "application/yaml" }
    });
}
