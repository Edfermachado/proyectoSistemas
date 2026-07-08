import { db } from "@/db";
import { events, spaces } from "@/db/schema";
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
   * Lógica de Negocio: Validar colisiones de horarios antes de crear un evento.
   */
  static async checkSpaceConflict(spaceId: string, eventDate: Date): Promise<boolean> {
    // Definimos una ventana de tiempo (ej. 3 horas)
    const startTime = new Date(eventDate);
    const endTime = new Date(eventDate.getTime() + 3 * 60 * 60 * 1000);

    // TODO: Implementar lógica de conflicto real usando los operadores de Drizzle
    // Por ahora retornamos falso asumiendo que no hay conflicto
    return false;
  }

  /**
   * Crea un evento validando las reglas de negocio.
   */
  static async createEvent(data: { title: string; date: Date; tenantId: string; spaceId: string; description?: string }) {
    const hasConflict = await this.checkSpaceConflict(data.spaceId, data.date);
    
    if (hasConflict) {
      throw new Error("CONF_001: El espacio ya está reservado para esa fecha y hora.");
    }

    const [newEvent] = await db.insert(events).values(data).returning();
    return newEvent;
  }
}
