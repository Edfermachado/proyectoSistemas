import { db } from "@/db";
import { events } from "@/db/schema";
import { eq, and, lte, gte } from "drizzle-orm";
import { generateUniqueSlug } from "@/lib/slug-helpers";

/**
 * Service Layer (Clean Architecture)
 * Toda la lógica de negocio debe vivir aquí y ser independiente del framework web.
 */
export class EventsService {
  /**
   * Obtiene todos los eventos de una facultad específica.
   */
  static async getEventsByTenant(tenantId: string) {
    return await db.query.events.findMany({
      where: eq(events.tenantId, tenantId),
      with: {
        space: true, // Incluir información del espacio mediante la relación definida
      },
      orderBy: (events, { desc }) => [desc(events.createdAt)],
    });
  }

  /**
   * Obtiene un evento por su ID.
   */
  static async getEventById(id: string) {
    return await db.query.events.findFirst({
      where: eq(events.id, id),
      with: {
        space: true,
      },
    });
  }

  /**
   * Lógica de Negocio: Validar colisiones de horarios considerando la duración.
   */
  static async checkSpaceConflict(spaceId: string, eventDate: Date, durationMinutes: number, excludeEventId?: string): Promise<boolean> {
    // Calculamos el inicio y fin del nuevo evento
    const newStart = eventDate.getTime();
    const newEnd = newStart + durationMinutes * 60 * 1000;

    // Buscamos eventos en un rango de +/- 1 día para estar seguros (por temas de medianoche)
    const oneDay = 24 * 60 * 60 * 1000;
    const lowerBound = new Date(newStart - oneDay);
    const upperBound = new Date(newEnd + oneDay);

    const overlappingEvents = await db.query.events.findMany({
      where: and(
        eq(events.spaceId, spaceId),
        gte(events.date, lowerBound),
        lte(events.date, upperBound)
      ),
    });

    for (const event of overlappingEvents) {
      if (excludeEventId && event.id === excludeEventId) continue;

      const eventStart = event.date.getTime();
      const eventEnd = eventStart + event.duration * 60 * 1000;

      // Hay colisión si startA < endB y startB < endA
      if (newStart < eventEnd && eventStart < newEnd) {
        return true;
      }
    }

    return false;
  }

  /**
   * Crea un evento validando las reglas de negocio.
   */
  static async createEvent(data: { title: string; date: Date; duration: number; price?: string; tenantId: string; spaceId: string; description?: string; imageUrl?: string | null; capacity?: number; visibility?: "publico" | "privado"; requiresIpProtection?: boolean; status?: string; paymentPhone?: string; paymentId?: string; paymentBank?: string; managerId?: string }) {
    const hasConflict = await this.checkSpaceConflict(data.spaceId, data.date, data.duration);
    
    if (hasConflict) {
      throw new Error("CONF_001: El espacio ya está reservado para esa fecha y hora.");
    }

    // Normalizar precio: si es 0, transformarlo a GRATIS
    let normalizedPrice = data.price;
    if (normalizedPrice && (normalizedPrice === "0" || normalizedPrice === "0.00" || parseFloat(normalizedPrice) === 0)) {
      normalizedPrice = "GRATIS";
    }

    const slug = await generateUniqueSlug("events", data.title);
    const [newEvent] = await db.insert(events).values({ ...data, price: normalizedPrice, slug }).returning();
    return newEvent;
  }

  /**
   * Actualiza un evento validando las reglas de negocio.
   */
  static async updateEvent(id: string, data: Partial<{ title: string; date: Date; duration: number; price: string; spaceId: string; description: string; imageUrl: string | null; capacity: number; visibility: "publico" | "privado"; requiresIpProtection: boolean; status: string; paymentPhone: string; paymentId: string; paymentBank: string; managerId: string }>) {
    if (data.spaceId || data.date || data.duration) {
      const currentEvent = await this.getEventById(id);
      if (!currentEvent) throw new Error("Event not found");

      const spaceId = data.spaceId || currentEvent.spaceId;
      const eventDate = data.date || currentEvent.date;
      const duration = data.duration || currentEvent.duration;

      const hasConflict = await this.checkSpaceConflict(spaceId, eventDate, duration, id);
      
      if (hasConflict) {
        throw new Error("CONF_001: El espacio ya está reservado para esa fecha y hora.");
      }
    }

    // Regenerate slug if title changed
    const slugUpdate = data.title ? { slug: await generateUniqueSlug("events", data.title, id) } : {};

    // Normalizar precio: si es 0, transformarlo a GRATIS
    let normalizedPrice = data.price;
    if (normalizedPrice !== undefined) {
      if (normalizedPrice === "0" || normalizedPrice === "0.00" || parseFloat(normalizedPrice) === 0) {
        normalizedPrice = "GRATIS";
      }
    }

    const [updatedEvent] = await db.update(events)
      .set({ ...data, ...(normalizedPrice !== undefined ? { price: normalizedPrice } : {}), ...slugUpdate })
      .where(eq(events.id, id))
      .returning();
    return updatedEvent;
  }

  /**
   * Elimina un evento.
   */
  static async deleteEvent(id: string) {
    const [deletedEvent] = await db.delete(events)
      .where(eq(events.id, id))
      .returning();
    return deletedEvent;
  }
}
