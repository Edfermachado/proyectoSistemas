import { db } from "@/db";
import { events, spaces } from "@/db/schema";
import { eq, and, lte, gte } from "drizzle-orm";
import { generateUniqueSlug } from "@/lib/slug-helpers";
import { spaceMutex } from "@/lib/mutex";

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
      where: and(eq(events.tenantId, tenantId), eq(events.isArchived, false)),
      with: {
        space: true,
      },
      orderBy: (events, { desc }) => [desc(events.createdAt)],
    });
  }

  /**
   * Obtiene todos los eventos públicos aprobados y no archivados.
   */
  static async getAllEvents() {
    return await db.query.events.findMany({
      where: and(eq(events.isArchived, false), eq(events.status, 'aprobado')),
      with: {
        space: true,
        tenant: {
          with: {
            university: true,
          },
        },
        department: true,
      },
      orderBy: (events, { desc }) => [desc(events.date)],
    });
  }

  /**
   * Obtiene eventos por departamento.
   */
  static async getEventsByDepartment(departmentId: string) {
    return await db.query.events.findMany({
      where: and(eq(events.departmentId, departmentId), eq(events.isArchived, false)),
      with: {
        space: true,
        department: true,
      },
      orderBy: (events, { desc }) => [desc(events.createdAt)],
    });
  }

  /**
   * Obtiene eventos pendientes de aprobación para la facultad (Decanato).
   */
  static async getPendingEventsByTenant(tenantId: string) {
    return await db.query.events.findMany({
      where: and(
        eq(events.tenantId, tenantId),
        eq(events.status, 'pendiente_aprobacion'),
        eq(events.isArchived, false)
      ),
      with: {
        space: true,
        department: true,
        manager: true,
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
        department: true,
        manager: true,
      },
    });
  }

  /**
   * Lógica de Negocio: Validar colisiones de horarios considerando la duración.
   */
  static async checkSpaceConflict(spaceId: string, eventDate: Date, durationMinutes: number, excludeEventId?: string, executor: any = db): Promise<boolean> {
    // Calculamos el inicio y fin del nuevo evento
    const newStart = eventDate.getTime();
    const newEnd = newStart + durationMinutes * 60 * 1000;

    // Buscamos eventos en un rango de +/- 1 día para estar seguros (por temas de medianoche)
    const oneDay = 24 * 60 * 60 * 1000;
    const lowerBound = new Date(newStart - oneDay);
    const upperBound = new Date(newEnd + oneDay);

    const overlappingEvents = await executor.query.events.findMany({
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
  static async createEvent(data: { title: string; date: Date; duration: number; price?: string; tenantId: string; departmentId?: string; spaceId: string; description?: string; imageUrl?: string | null; capacity?: number; visibility?: "publico" | "privado"; requiresIpProtection?: boolean; status?: string; paymentPhone?: string; paymentId?: string; paymentBank?: string; managerId?: string }) {
    return await spaceMutex.runExclusive(data.spaceId, async () => {
      return await db.transaction(async (tx) => {
        const space = await tx.query.spaces.findFirst({
          where: eq(spaces.id, data.spaceId),
        });
        if (!space) throw new Error("Space not found");
        if (data.capacity && data.capacity > space.capacity) {
          throw new Error(`El aforo del evento (${data.capacity}) no puede exceder la capacidad máxima física del espacio "${space.name}" (${space.capacity} personas).`);
        }

        const hasConflict = await this.checkSpaceConflict(data.spaceId, data.date, data.duration, undefined, tx);
        
        if (hasConflict) {
          throw new Error("CONF_001: El espacio ya está reservado para esa fecha y hora.");
        }

        const slug = await generateUniqueSlug("events", data.title);
        const eventStatus = data.status || 'pendiente_aprobacion';
        const [newEvent] = await tx.insert(events).values({ ...data, status: eventStatus, slug }).returning();
        return newEvent;
      });
    });
  }

  /**
   * Aprueba un evento propuesto por un departamento (Realizado por Decanato / Tenant Admin).
   */
  static async approveEvent(id: string) {
    const [updatedEvent] = await db.update(events)
      .set({ status: 'aprobado' })
      .where(eq(events.id, id))
      .returning();
    return updatedEvent;
  }

  /**
   * Rechaza un evento propuesto por un departamento.
   */
  static async rejectEvent(id: string) {
    const [updatedEvent] = await db.update(events)
      .set({ status: 'rechazado' })
      .where(eq(events.id, id))
      .returning();
    return updatedEvent;
  }

  /**
   * Actualiza un evento validando las reglas de negocio.
   */
  static async updateEvent(id: string, data: Partial<{ title: string; date: Date; duration: number; price: string; spaceId: string; description: string; imageUrl: string | null; capacity: number; visibility: "publico" | "privado"; requiresIpProtection: boolean; status: string; paymentPhone: string; paymentId: string; paymentBank: string; managerId: string }>) {
    const currentEvent = await this.getEventById(id);
    if (!currentEvent) throw new Error("Event not found");

    const spaceId = data.spaceId || currentEvent.spaceId;
    const eventDate = data.date || currentEvent.date;
    const duration = data.duration || currentEvent.duration;

    return await spaceMutex.runExclusive(spaceId, async () => {
      return await db.transaction(async (tx) => {
        const targetCapacity = data.capacity !== undefined ? data.capacity : currentEvent.capacity;
        if (targetCapacity) {
          const space = await tx.query.spaces.findFirst({
            where: eq(spaces.id, spaceId),
          });
          if (space && targetCapacity > space.capacity) {
            throw new Error(`El aforo del evento (${targetCapacity}) no puede exceder la capacidad máxima física del espacio "${space.name}" (${space.capacity} personas).`);
          }
        }

        if (data.spaceId || data.date || data.duration) {
          const hasConflict = await this.checkSpaceConflict(spaceId, eventDate, duration, id, tx);
          
          if (hasConflict) {
            throw new Error("CONF_001: El espacio ya está reservado para esa fecha y hora.");
          }
        }

        // Regenerate slug if title changed
        const slugUpdate = data.title ? { slug: await generateUniqueSlug("events", data.title, id) } : {};

        const [updatedEvent] = await tx.update(events)
          .set({ ...data, ...slugUpdate })
          .where(eq(events.id, id))
          .returning();
        return updatedEvent;
      });
    });
  }

  /**
   * Elimina un evento.
   */
  static async deleteEvent(id: string) {
    const [deletedEvent] = await db.update(events)
      .set({ deletedAt: new Date(), isArchived: true })
      .where(eq(events.id, id))
      .returning();
    return deletedEvent;
  }
}
