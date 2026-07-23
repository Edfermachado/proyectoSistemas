import { NextResponse } from "next/server";
import { SpacesService } from "@/services/spaces.service";
import { db } from "@/db";
import { tenants } from "@/db/schema";
import { eq } from "drizzle-orm";

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
    
    if (!body.universityId) {
       // Si se envía tenantId, debemos buscar el universityId del tenant
       if (body.tenantId) {
         const tenant = await db.query.tenants.findFirst({
           where: eq(tenants.id, body.tenantId),
           columns: { universityId: true }
         });
         if (tenant && tenant.universityId) {
           body.universityId = tenant.universityId;
         } else {
           return NextResponse.json({ error: "Tenant not found or has no university" }, { status: 400 });
         }
       } else {
         return NextResponse.json({ error: "Missing universityId" }, { status: 400 });
       }
    }
    
    const newSpace = await SpacesService.createSpace({
      name: body.name,
      capacity: body.capacity,
      universityId: body.universityId
    });
    return NextResponse.json(newSpace, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
