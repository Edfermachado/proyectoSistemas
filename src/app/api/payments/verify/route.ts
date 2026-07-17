import { NextResponse } from "next/server";
import { db } from "@/db";
import { attendees, events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    // Any tenant_admin can verify for their tenant
    if (!session || session.role !== "tenant_admin") {
      return NextResponse.json({ error: "Unauthorized. Solo los administradores de facultad pueden verificar pagos." }, { status: 401 });
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

    if (attendee.event.tenantId !== session.tenantId) {
      return NextResponse.json({ error: "Forbidden. No tienes permisos para este evento." }, { status: 403 });
    }

    if (action === 'approve') {
      await db.update(attendees)
        .set({
          status: 'confirmado',
          paymentVerifiedBy: session.userId as string,
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
