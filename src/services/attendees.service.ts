import { db } from "@/db";
import { attendees, events } from "@/db/schema";
import { eq, asc, and, sql } from "drizzle-orm";

export class AttendeesService {
  static async registerAttendee(data: { eventId: string; name: string; email: string; phone: string; status?: "registrado" | "confirmado" | "pago_pendiente", userId?: string, attendeeType?: "estudiante" | "foraneo", paymentReference?: string, paymentScreenshotUrl?: string | null }) {
    // Check if event exists
    const event = await db.query.events.findFirst({ 
      where: eq(events.id, data.eventId),
      with: { space: true }
    });
    if (!event) throw new Error("Event not found");

    // Avoid duplicate registration
    if (data.userId) {
      const existing = await db.query.attendees.findFirst({
        where: and(eq(attendees.eventId, data.eventId), eq(attendees.userId, data.userId))
      });
      if (existing) {
        throw new Error("Ya estás registrado en este evento.");
      }
    }

    // Capacity Check
    const capacity = event.capacity ?? event.space?.capacity;
    if (capacity) {
      const attendeesCountResult = await db.execute(sql`SELECT count(*) as count FROM ${attendees} WHERE event_id = ${data.eventId}`);
      const currentCount = Number(attendeesCountResult[0]?.count || 0);
      if (currentCount >= capacity) {
        throw new Error("Lo sentimos, el evento ha alcanzado su capacidad máxima (sold out).");
      }
    }

    // Determine status based on price if not explicitly provided
    let status = data.status;
    if (!status) {
       const isFree = event.price === 'FREE' || event.price === 'GRATIS' || event.price === '0' || !event.price;
       status = isFree ? "confirmado" : "pago_pendiente";
    }

    const [newAttendee] = await db.insert(attendees).values({
      eventId: data.eventId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: status,
      userId: data.userId,
      attendeeType: data.attendeeType || "estudiante",
      paymentReference: data.paymentReference,
      paymentScreenshotUrl: data.paymentScreenshotUrl,
    }).returning();

    return newAttendee;
  }

  static async getAttendeesByEvent(eventId: string) {
    return await db.query.attendees.findMany({
      where: eq(attendees.eventId, eventId),
      orderBy: (attendees, { asc }) => [asc(attendees.createdAt)],
    });
  }

  static async confirmPayment(attendeeId: string, verifierId: string) {
    const [updated] = await db.update(attendees)
      .set({ 
        status: "confirmado",
        paymentVerifiedBy: verifierId,
        paymentVerifiedAt: new Date()
      })
      .where(eq(attendees.id, attendeeId))
      .returning();
    return updated;
  }

  static async removeAttendee(attendeeId: string) {
    await db.delete(attendees).where(eq(attendees.id, attendeeId));
  }
}
