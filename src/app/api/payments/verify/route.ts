import { NextResponse } from "next/server";
import { db } from "@/db";
import { attendees, events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    // Only event_manager can verify (as requested by user)
    if (!session || session.role !== "event_manager") {
      return NextResponse.json({ error: "Unauthorized. Solo los gestores de evento pueden verificar pagos." }, { status: 401 });
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

    if (attendee.event.managerId !== session.id) {
      return NextResponse.json({ error: "Forbidden. No eres el gestor asignado a este evento." }, { status: 403 });
    }

    if (action === 'approve') {
      await db.update(attendees)
        .set({
          status: 'confirmado',
          paymentVerifiedBy: session.id as string,
          paymentVerifiedAt: new Date()
        })
        .where(eq(attendees.id, attendeeId));
    } else if (action === 'reject') {
      await db.update(attendees)
        .set({
          status: 'registrado', // Or a new status like 'pago_rechazado' if we added it, but fallback to registrado to force them to try again, or clear the reference
          paymentReference: null,
          paymentScreenshotUrl: null
        })
        .where(eq(attendees.id, attendeeId));
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("[POST /api/payments/verify]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
