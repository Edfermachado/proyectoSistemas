import { NextResponse } from "next/server";
import { TenantsService } from "@/services/tenants.service";

export async function GET() {
  try {
    const data = await TenantsService.getAllTenants();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[GET /api/tenants]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTenant = await TenantsService.createTenant(body);
    return NextResponse.json(newTenant, { status: 201 });
  } catch (error) {
    console.error("[POST /api/tenants]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
