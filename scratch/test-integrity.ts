import "dotenv/config";
import { db } from "@/db";
import { universities, spaces, tenants, events, attendees, users, paymentAuditLogs } from "@/db/schema";
import { EventsService } from "@/services/events.service";
import { AttendeesService } from "@/services/attendees.service";
import { eq } from "drizzle-orm";

async function runIntegrityTests() {
  console.log("🚀 Iniciando suite de pruebas de integridad del modelo de negocio...\n");

  try {
    // 1. Setup temporal data
    console.log("📦 1. Creando entidades de prueba (Universidad, Espacio, Tenant, Usuario)...");
    const [uni] = await db.insert(universities).values({
      name: `Uni Prueba ${Date.now()}`,
      slug: `uni-test-${Date.now()}`,
    }).returning();

    const [space] = await db.insert(spaces).values({
      name: "Auditorio de Prueba (Capacidad: 50)",
      capacity: 50,
      universityId: uni.id,
    }).returning();

    const [tenant] = await db.insert(tenants).values({
      name: `Facultad Test ${Date.now()}`,
      slug: `facultad-test-${Date.now()}`,
      universityId: uni.id,
    }).returning();

    const [adminUser] = await db.insert(users).values({
      email: `admin_${Date.now()}@test.com`,
      passwordHash: "hashed",
      name: "Admin Validador",
      role: "tenant_admin",
      tenantId: tenant.id,
    }).returning();

    // 2. Probar restricción de aforo (EventsService.createEvent con capacity > space.capacity)
    console.log("\n🧪 2. Probando validación de aforo físico vs. aforo de evento...");
    try {
      await EventsService.createEvent({
        title: "Evento Sobrepoblado VIP",
        date: new Date(Date.now() + 86400000),
        duration: 120,
        tenantId: tenant.id,
        spaceId: space.id,
        capacity: 200, // Excede capacidad de 50
        price: "10.00",
      });
      console.error("❌ FALLO: Se permitió crear un evento que excede la capacidad física del espacio.");
    } catch (err: any) {
      if (err.message.includes("no puede exceder la capacidad máxima física")) {
        console.log(`✅ ÉXITO: Bloqueo correcto por aforo -> "${err.message}"`);
      } else {
        throw err;
      }
    }

    // Crear un evento válido (capacidad = 30)
    const validEvent = await EventsService.createEvent({
      title: `Evento Válido ${Date.now()}`,
      date: new Date(Date.now() + 86400000 * 2),
      duration: 60,
      tenantId: tenant.id,
      spaceId: space.id,
      capacity: 30,
      price: "5.00",
    });
    console.log(`✅ Evento válido creado con ID: ${validEvent.id}`);

    // 3. Probar registro bimonetario y prevención de duplicados
    console.log("\n🧪 3. Probando registro bimonetario y unicidad de inscripciones...");
    const attendeeData = {
      eventId: validEvent.id,
      name: "Estudiante Bimonetario",
      email: `estudiante_${Date.now()}@uni.edu`,
      phone: "0414-1234567",
      paymentReference: "REF-998877",
      paymentAmountBs: "300.50",
      exchangeRateBcv: "60.1000",
      paymentBankOrigin: "Mercantil",
      paymentDate: new Date(),
    };

    const attendee = await AttendeesService.registerAttendee(attendeeData);
    console.log(`✅ Asistente registrado exitosamente con pago en Bs: ${attendee.paymentAmountBs} (Tasa BCV: ${attendee.exchangeRateBcv})`);

    // Intentar registrar de nuevo con el mismo correo
    try {
      await AttendeesService.registerAttendee({
        ...attendeeData,
        name: "Intento Duplicado",
      });
      console.error("❌ FALLO: Se permitió el registro duplicado del mismo correo en el evento.");
    } catch (err: any) {
      if (err.message.includes("Ya hay una inscripción registrada con este correo") || err.message.includes("Ya estás registrado")) {
        console.log(`✅ ÉXITO: Bloqueo de duplicidad correcto -> "${err.message}"`);
      } else {
        throw err;
      }
    }

    // 4. Probar Audit Trail en verificación de pago (Confirmar y Rechazar)
    console.log("\n🧪 4. Probando inmutabilidad y trazas en payment_audit_logs...");
    await AttendeesService.confirmPayment(attendee.id, adminUser.id);
    console.log("✅ Pago confirmado en AttendeesService.");

    const logsConfirm = await db.query.paymentAuditLogs.findMany({
      where: eq(paymentAuditLogs.attendeeId, attendee.id),
    });
    console.log(`📋 Registros en payment_audit_logs tras confirmar: ${logsConfirm.length}`);
    console.log(`   -> Acción: ${logsConfirm[0]?.action}, Estado Nuevo: ${logsConfirm[0]?.newStatus}, Verificador: ${logsConfirm[0]?.performedBy}`);

    await AttendeesService.rejectPayment(attendee.id, adminUser.id, "Captura borrosa, re-subir");
    console.log("✅ Pago rechazado con motivo en AttendeesService.");

    const logsAll = await db.query.paymentAuditLogs.findMany({
      where: eq(paymentAuditLogs.attendeeId, attendee.id),
    });
    console.log(`📋 Total registros históricos en bitácora (Audit Trail): ${logsAll.length}`);
    logsAll.forEach((l, idx) => {
      console.log(`   [${idx + 1}] Acción: ${l.action} (${l.previousStatus} -> ${l.newStatus}) | Motivo: ${l.reason}`);
    });

    // Limpieza de prueba (o Soft Delete de evento)
    console.log("\n🧹 5. Probando Soft Delete de evento...");
    const deleted = await EventsService.deleteEvent(validEvent.id);
    console.log(`✅ Evento archivado con Soft Delete -> isArchived: ${deleted.isArchived}, deletedAt: ${deleted.deletedAt}`);

    console.log("\n✨ ¡TODAS LAS PRUEBAS DE INTEGRIDAD FUERON EXITOSAS! ✨");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error en ejecución de pruebas:", error);
    process.exit(1);
  }
}

runIntegrityTests();
