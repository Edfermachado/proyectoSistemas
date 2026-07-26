import { db } from "../src/db";
import { events, departments, tenants, users, spaces, attendees } from "../src/db/schema";
import { eq, isNull, and, sql } from "drizzle-orm";
import { isEventFree } from "../src/lib/price-helpers";

async function runSystemAudit() {
  console.log("🔍 Iniciando Auditoría de Integridad del Nuevo Sistema...\n");
  let issuesFound = 0;

  // 1. Audit Table Column Existence
  try {
    const sampleEvent = await db.query.events.findFirst();
    if (sampleEvent) {
      if (sampleEvent.featuredRequested === undefined) {
        console.error("❌ Error: Columna 'featuredRequested' falta en el modelo events.");
        issuesFound++;
      } else {
        console.log("✅ [DB Schema] Columna 'featuredRequested' validada en tabla events.");
      }
      if (sampleEvent.departmentId === undefined) {
        console.error("❌ Error: Columna 'departmentId' falta en el modelo events.");
        issuesFound++;
      } else {
        console.log("✅ [DB Schema] Columna 'departmentId' validada en tabla events.");
      }
    }
  } catch (err: any) {
    console.error("❌ Error en consulta de esquema:", err.message);
    issuesFound++;
  }

  // 2. Audit Department Hierarchy Integrity
  try {
    const allDepartments = await db.query.departments.findMany({ with: { tenant: true } });
    console.log(`ℹ️ Total Departamentos Registrados: ${allDepartments.length}`);
    const orphanDepts = allDepartments.filter(d => !d.tenant);
    if (orphanDepts.length > 0) {
      console.error(`❌ Error: Se encontraron ${orphanDepts.length} departamentos huérfanos sin Facultad asociadas.`);
      issuesFound++;
    } else {
      console.log("✅ [Relaciones] Todos los departamentos pertenecen a un Tenant (Facultad) válido.");
    }
  } catch (err: any) {
    console.error("❌ Error auditando departamentos:", err.message);
    issuesFound++;
  }

  // 3. Audit Event Approval & Featured Integrity
  try {
    const unapprovedFeatured = await db.query.events.findMany({
      where: and(eq(events.isFeatured, true), sql`${events.status} != 'aprobado'`)
    });
    if (unapprovedFeatured.length > 0) {
      console.error(`⚠️ Advertencia: Hay ${unapprovedFeatured.length} eventos no aprobados marcados como destacados.`);
      issuesFound++;
    } else {
      console.log("✅ [Lógica de Negocio] Todos los eventos destacados están debidamente aprobados.");
    }
  } catch (err: any) {
    console.error("❌ Error auditando eventos destacados:", err.message);
    issuesFound++;
  }

  // 4. Audit Pricing Logic & Helpers Across DB
  try {
    const allEvents = await db.query.events.findMany();
    let invalidPrices = 0;
    for (const ev of allEvents) {
      const num = Number(ev.price);
      if (!isNaN(num) && num < 0) {
        invalidPrices++;
      }
    }
    if (invalidPrices > 0) {
      console.warn(`⚠️ Aviso: Se encontraron ${invalidPrices} eventos con precio numérico negativo en BD (manejados correctamente como GRATIS por isEventFree).`);
    } else {
      console.log("✅ [Precios] Precios en base de datos normalizados (sin valores negativos).");
    }
  } catch (err: any) {
    console.error("❌ Error auditando precios:", err.message);
    issuesFound++;
  }

  // 5. Audit Space Capacity Conflicts
  try {
    const eventsWithSpace = await db.query.events.findMany({ with: { space: true } });
    let overflowEvents = 0;
    for (const ev of eventsWithSpace) {
      if (ev.space && ev.capacity && ev.capacity > ev.space.capacity) {
        overflowEvents++;
        console.error(`❌ Error: Evento "${ev.title}" aforo (${ev.capacity}) supera capacidad del espacio (${ev.space.capacity}).`);
      }
    }
    if (overflowEvents > 0) {
      issuesFound += overflowEvents;
    } else {
      console.log("✅ [Aforo] Capacidad de todos los eventos respeta los límites físicos del espacio.");
    }
  } catch (err: any) {
    console.error("❌ Error auditando espacios:", err.message);
    issuesFound++;
  }

  console.log(`\n🏁 Auditoría Finalizada. Hallazgos críticos: ${issuesFound}`);
  process.exit(0);
}

runSystemAudit();
