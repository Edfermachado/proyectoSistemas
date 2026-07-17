import { NextResponse } from 'next/server';
import { db } from '@/db';
import { attendees, scanLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    // Only allow authenticated users (like tenant_admin, event_manager, or access_control) to validate tickets
    const session = await getSession();
    const allowedRoles = ['tenant_admin', 'event_manager', 'superadmin', 'access_control'];
    if (!session || !allowedRoles.includes(session.role as string)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Find the registration by token
    const registration = await db.query.attendees.findFirst({
      where: eq(attendees.ticketToken, token),
      with: {
        event: true,
      }
    });

    if (!registration) {
      return NextResponse.json({ error: 'Entrada no encontrada (404)' }, { status: 404 });
    }

    if (registration.scannedAt) {
      return NextResponse.json({ 
        error: 'Entrada ya utilizada (409)', 
        scannedAt: registration.scannedAt 
      }, { status: 409 });
    }

    // Update the scanned_at timestamp to mark it as used
    await db.update(attendees)
      .set({ scannedAt: new Date() })
      .where(eq(attendees.id, registration.id));

    // Register who scanned it in the logs
    await db.insert(scanLogs).values({
      eventId: registration.eventId,
      attendeeId: registration.id,
      scannedBy: session.id as string,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Acceso Permitido (200)',
      attendee: {
        name: registration.name,
        type: registration.attendeeType,
        event: registration.event?.title
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Ticket validation error:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
