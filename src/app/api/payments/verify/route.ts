import { NextResponse } from "next/server";
import { db } from "@/db";
import { attendees } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { AttendeesService } from "@/services/attendees.service";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const allowedRoles = ["superadmin", "tenant_admin", "event_manager"];
    if (!session || !session.userId || !allowedRoles.includes(session.role as string)) {
      return NextResponse.json({ error: "Unauthorized. No tienes permisos para verificar pagos." }, { status: 401 });
    }

    const body = await request.json();
    const attendeeId = body.attendeeId;
    const action = body.action; // 'approve' or 'reject'

    if (!attendeeId || !action) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Verify attendee exists and manager is assigned to this event
    const attendee = await db.query.attendees.findFirst({
      where: eq(attendees.id, attendeeId),
      with: {
        event: true
      }
    });

    if (!attendee) {
      return NextResponse.json({ error: "Attendee not found" }, { status: 404 });
    }

    // Check permissions
    if (session.role === "tenant_admin" && attendee.event.tenantId !== session.tenantId) {
      return NextResponse.json({ error: "Forbidden. No tienes permisos para este evento." }, { status: 403 });
    }
    
    if (session.role === "event_manager" && attendee.event.managerId !== session.userId) {
      return NextResponse.json({ error: "Forbidden. Solo el gestor responsable de este evento puede verificar sus pagos." }, { status: 403 });
    }

    if (action === 'approve') {
      await AttendeesService.confirmPayment(attendeeId, session.userId as string);
    } else if (action === 'reject') {
      await AttendeesService.rejectPayment(attendeeId, session.userId as string);
    }

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    console.error("[POST /api/payments/verify]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
