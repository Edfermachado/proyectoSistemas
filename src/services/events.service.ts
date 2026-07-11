import { db } from "@/db";
import { events } from "@/db/schema";
import { eq, and, lte, gte } from "drizzle-orm";

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
   * Lógica de Negocio: Validar colisiones de horarios antes de crear o actualizar un evento.
   */
  static async checkSpaceConflict(spaceId: string, eventDate: Date, excludeEventId?: string): Promise<boolean> {
    // Definimos una ventana de tiempo (ej. 3 horas)
    const threeHours = 3 * 60 * 60 * 1000;
    const lowerBound = new Date(eventDate.getTime() - threeHours);
    const upperBound = new Date(eventDate.getTime() + threeHours);

    const overlappingEvents = await db.query.events.findMany({
      where: and(
        eq(events.spaceId, spaceId),
        gte(events.date, lowerBound),
        lte(events.date, upperBound)
      ),
    });

    if (excludeEventId) {
      return overlappingEvents.some(event => event.id !== excludeEventId);
    }

    return overlappingEvents.length > 0;
  }

  /**
   * Crea un evento validando las reglas de negocio.
   */
  static async createEvent(data: { title: string; date: Date; price?: string; tenantId: string; spaceId: string; description?: string; imageUrl?: string | null }) {
    const hasConflict = await this.checkSpaceConflict(data.spaceId, data.date);
    
    if (hasConflict) {
      throw new Error("CONF_001: El espacio ya está reservado para esa fecha y hora.");
    }

    const [newEvent] = await db.insert(events).values(data).returning();
    return newEvent;
  }

  /**
   * Actualiza un evento validando las reglas de negocio.
   */
  static async updateEvent(id: string, data: Partial<{ title: string; date: Date; price: string; spaceId: string; description: string; imageUrl: string | null }>) {
    if (data.spaceId || data.date) {
      const currentEvent = await this.getEventById(id);
      if (!currentEvent) throw new Error("Event not found");

      const spaceId = data.spaceId || currentEvent.spaceId;
      const eventDate = data.date || currentEvent.date;

      const hasConflict = await this.checkSpaceConflict(spaceId, eventDate, id);
      
      if (hasConflict) {
        throw new Error("CONF_001: El espacio ya está reservado para esa fecha y hora.");
      }
    }

    const [updatedEvent] = await db.update(events)
      .set(data)
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
