import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

import { eq, and } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const roleParam = searchParams.get("role");

    let whereClause = eq(users.tenantId, session.tenantId as string);
    if (roleParam) {
      whereClause = and(whereClause, eq(users.role, roleParam)) as any;
    } else {
      whereClause = and(whereClause, eq(users.role, "event_manager")) as any;
    }

    const managers = await db.query.users.findMany({
      where: whereClause,
      columns: {
        id: true,
        email: true,
        role: true,
      }
    });

    return NextResponse.json(managers);
  } catch (error: any) {
    console.error("[GET /api/users/managers]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "tenant_admin" && session.role !== "superadmin") || !session.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    const allowedRoles = ["event_manager", "access_control"];
    const role = allowedRoles.includes(body.role) ? body.role : "event_manager";

    const hashedPassword = await bcrypt.hash(body.passwordHash, 10);

    // Create the manager securely associated with the admin's tenant
    const [newUser] = await db.insert(users).values({
      email: body.email,
      passwordHash: hashedPassword,
      role: role,
      tenantId: session.tenantId as string,
    }).returning();

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/users/managers]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
