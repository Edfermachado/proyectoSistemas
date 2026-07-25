import { db } from "@/db";
import { attendees, events, paymentAuditLogs } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { eventMutex } from "@/lib/mutex";

export class AttendeesService {
  static async registerAttendee(data: { 
    eventId: string; 
    name: string; 
    email: string; 
    phone: string; 
    status?: "registrado" | "confirmado" | "pago_pendiente"; 
    userId?: string; 
    attendeeType?: "estudiante" | "foraneo"; 
    paymentReference?: string; 
    paymentScreenshotUrl?: string | null;
    paymentAmountBs?: string;
    exchangeRateBcv?: string;
    paymentBankOrigin?: string;
    paymentDate?: Date;
  }) {
    return await eventMutex.runExclusive(data.eventId, async () => {
      return await db.transaction(async (tx) => {
        // Check if event exists
        const event = await tx.query.events.findFirst({ 
          where: eq(events.id, data.eventId),
          with: { space: true }
        });
        if (!event) throw new Error("Event not found");

        // Avoid duplicate registration by userId
        if (data.userId) {
          const existingUser = await tx.query.attendees.findFirst({
            where: and(eq(attendees.eventId, data.eventId), eq(attendees.userId, data.userId))
          });
          if (existingUser) {
            throw new Error("Ya estás registrado en este evento.");
          }
        }

        // Avoid duplicate registration by email
        const existingEmail = await tx.query.attendees.findFirst({
          where: and(eq(attendees.eventId, data.eventId), eq(attendees.email, data.email))
        });
        if (existingEmail) {
          throw new Error("Ya hay una inscripción registrada con este correo en el evento.");
        }

        // Capacity Check
        const capacity = event.capacity ?? event.space?.capacity;
        if (capacity) {
          const attendeesCountResult = await tx.execute(sql`SELECT count(*) as count FROM ${attendees} WHERE event_id = ${data.eventId}`);
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

        const [newAttendee] = await tx.insert(attendees).values({
          eventId: data.eventId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          status: status,
          userId: data.userId,
          attendeeType: data.attendeeType || "estudiante",
          paymentReference: data.paymentReference,
          paymentScreenshotUrl: data.paymentScreenshotUrl,
          paymentAmountBs: data.paymentAmountBs,
          exchangeRateBcv: data.exchangeRateBcv,
          paymentBankOrigin: data.paymentBankOrigin,
          paymentDate: data.paymentDate,
        }).returning();

        return newAttendee;
      });
    });
  }

  static async getAttendeesByEvent(eventId: string) {
    return await db.query.attendees.findMany({
      where: eq(attendees.eventId, eventId),
      orderBy: (attendees, { asc }) => [asc(attendees.createdAt)],
    });
  }

  static async confirmPayment(attendeeId: string, verifierId: string) {
    return await db.transaction(async (tx) => {
      const current = await tx.query.attendees.findFirst({
        where: eq(attendees.id, attendeeId),
      });
      if (!current) throw new Error("Attendee not found");

      const [updated] = await tx.update(attendees)
        .set({ 
          status: "confirmado",
          paymentVerifiedBy: verifierId,
          paymentVerifiedAt: new Date()
        })
        .where(eq(attendees.id, attendeeId))
        .returning();

      await tx.insert(paymentAuditLogs).values({
        attendeeId,
        action: "APROBADO",
        previousStatus: current.status || "pago_pendiente",
        newStatus: "confirmado",
        performedBy: verifierId,
        reason: "Pago Móvil verificado e ingresado en cuenta",
      });

      return updated;
    });
  }

  static async rejectPayment(attendeeId: string, verifierId: string, reason: string = "Pago rechazado o ilegible") {
    return await db.transaction(async (tx) => {
      const current = await tx.query.attendees.findFirst({
        where: eq(attendees.id, attendeeId),
      });
      if (!current) throw new Error("Attendee not found");

      const [updated] = await tx.update(attendees)
        .set({ 
          status: "registrado",
          paymentVerifiedBy: verifierId,
          paymentVerifiedAt: new Date()
        })
        .where(eq(attendees.id, attendeeId))
        .returning();

      await tx.insert(paymentAuditLogs).values({
        attendeeId,
        action: "RECHAZADO",
        previousStatus: current.status || "pago_pendiente",
        newStatus: "registrado",
        performedBy: verifierId,
        reason,
      });

      return updated;
    });
  }

  static async removeAttendee(attendeeId: string) {
    await db.delete(attendees).where(eq(attendees.id, attendeeId));
  }
}

