import { NextResponse } from "next/server";
import { db } from "@/db";
import { attendees } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ notifications: [] });
    }

    // Fetch user's attendees
    const userAttendees = await db.query.attendees.findMany({
      where: eq(attendees.userId, session.userId as string),
      with: {
        event: true
      },
      orderBy: (attendees, { desc }) => [desc(attendees.createdAt)]
    });

    const notifications = [];

    for (const att of userAttendees) {
      if (att.status === "pago_pendiente" && !att.paymentReference) {
        notifications.push({
          id: `pending-${att.id}`,
          title: "Pago Pendiente",
          message: `Tienes un pago pendiente para el evento "${att.event.title}".`,
          type: "warning",
          link: "/profile",
          createdAt: att.createdAt
        });
      } else if (att.status === "pago_pendiente" && att.paymentReference) {
        notifications.push({
          id: `verifying-${att.id}`,
          title: "Pago en Verificación",
          message: `El pago para "${att.event.title}" está siendo verificado.`,
          type: "info",
          link: "/profile",
          createdAt: att.createdAt
        });
      } else if (att.status === "confirmado" && att.ticketToken) {
        // If it was scanned we could ignore, but let's just show it if it was confirmed recently (we don't have updated_at, let's just show it)
        notifications.push({
          id: `confirmed-${att.id}`,
          title: "Entrada Confirmada",
          message: `Tu entrada para "${att.event.title}" ha sido confirmada.`,
          type: "success",
          link: `/profile?viewTicket=${att.ticketToken}`,
          createdAt: att.paymentVerifiedAt || att.createdAt
        });
      }
    }

    // Sort by most recent
    notifications.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json({ notifications });
  } catch (error: unknown) {
    console.error("Notifications fetch error:", error);
    return NextResponse.json({ notifications: [] });
  }
}
