import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { tenants } from "@/db/schema";

export async function GET() {
  const session = await getSession();
  if (!session || !session.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const faculty = await db.query.tenants.findFirst({ 
    where: eq(tenants.id, session.tenantId as string) 
  });
  
  return NextResponse.json(faculty);
}
