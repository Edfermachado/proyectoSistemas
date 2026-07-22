import { NextResponse } from "next/server";
import { UsersService } from "@/services/users.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    
    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId param" }, { status: 400 });
    }

    const data = await UsersService.getUsersByTenant(tenantId);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (body.role === "tenant_admin") {
      if (!body.name || !body.lastName || !body.documentId || !body.phone) {
        return NextResponse.json({ error: "Personal information (name, lastName, documentId, phone) is required for tenant administrators." }, { status: 400 });
      }
    }
    
    const newUser = await UsersService.createUser(body);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
