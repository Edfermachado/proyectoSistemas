import { db } from "@/db";
import { attendees, events } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export class AttendeesService {
  static async registerAttendee(data: { eventId: string; name: string; email: string; phone: string; status?: "pending" | "confirmed" }) {
    // Check if event exists
    const event = await db.query.events.findFirst({ where: eq(events.id, data.eventId) });
    if (!event) throw new Error("Event not found");

    // Check if there is capacity left? Currently we don't track capacity directly on the event, but on the space.
    // For now, simple registration.
    
    // Determine status based on price if not explicitly provided
    let status = data.status;
    if (!status) {
       const isFree = event.price?.toUpperCase() === 'FREE' || event.price?.toUpperCase() === 'GRATIS' || event.price === '0';
       status = isFree ? "confirmed" : "pending";
    }

    const [newAttendee] = await db.insert(attendees).values({
      eventId: data.eventId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: status,
    }).returning();

    return newAttendee;
  }

  static async getAttendeesByEvent(eventId: string) {
    return await db.query.attendees.findMany({
      where: eq(attendees.eventId, eventId),
      orderBy: (attendees, { asc }) => [asc(attendees.createdAt)],
    });
  }

  static async confirmPayment(attendeeId: string) {
    const [updated] = await db.update(attendees)
      .set({ status: "confirmed" })
      .where(eq(attendees.id, attendeeId))
      .returning();
    return updated;
  }

  static async removeAttendee(attendeeId: string) {
    await db.delete(attendees).where(eq(attendees.id, attendeeId));
  }
}
