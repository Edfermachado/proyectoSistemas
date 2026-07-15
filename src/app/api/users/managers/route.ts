import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "tenant_admin" || !session.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    const allowedRoles = ["event_manager", "access_control"];
    const role = allowedRoles.includes(body.role) ? body.role : "event_manager";

    // Create the manager securely associated with the admin's tenant
    const [newUser] = await db.insert(users).values({
      email: body.email,
      passwordHash: body.passwordHash, // Simplification for prototype
      role: role,
      tenantId: session.tenantId as string,
    }).returning();

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/users/managers]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
