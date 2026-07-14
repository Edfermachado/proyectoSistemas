import { db } from "../src/db";
import { attendees, events } from "../src/db/schema";
import { inArray, lt } from "drizzle-orm";

async function cleanupExpiredQRs() {
  console.log("🧹 Iniciando limpieza de códigos QR vencidos...");
  
  try {
    // Calculamos la fecha límite (hace 60 días)
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 60);

    console.log(`Buscando eventos anteriores al: ${thresholdDate.toISOString()}`);

    // Obtenemos los IDs de los eventos que ocurrieron hace más de 60 días
    const expiredEvents = await db.select({ id: events.id })
      .from(events)
      .where(lt(events.date, thresholdDate));

    if (expiredEvents.length === 0) {
      console.log("✅ No hay eventos vencidos de hace más de 60 días.");
      process.exit(0);
    }

    const eventIds = expiredEvents.map(e => e.id);
    console.log(`Se encontraron ${eventIds.length} eventos vencidos.`);

    // Establecemos el ticketToken a null para todos los asistentes de esos eventos, vaciando el QR de la BD
    const result = await db.update(attendees)
      .set({ ticketToken: null })
      .where(inArray(attendees.eventId, eventIds))
      .returning({ id: attendees.id });

    console.log(`✅ ¡Limpieza completada! Se vaciaron y vencieron exitosamente ${result.length} códigos QR de la base de datos.`);
  } catch (error) {
    console.error("❌ Error al limpiar los códigos QR:", error);
  } finally {
    process.exit(0);
  }
}

cleanupExpiredQRs();
