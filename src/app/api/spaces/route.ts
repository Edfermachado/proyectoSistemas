import { NextResponse } from "next/server";
import { SpacesService } from "@/services/spaces.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    
    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId param" }, { status: 400 });
    }

    const data = await SpacesService.getSpacesByTenant(tenantId);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newSpace = await SpacesService.createSpace(body);
    return NextResponse.json(newSpace, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
