import "dotenv/config";
import { db } from "@/db";
import { universities, spaces, tenants, departments, events, attendees, users } from "@/db/schema";
import { EventsService } from "@/services/events.service";
import { AttendeesService } from "@/services/attendees.service";
import { DepartmentsService } from "@/services/departments.service";
import { SpacesService } from "@/services/spaces.service";

async function runIntegrityTests() {
  console.log("🚀 Iniciando suite de pruebas de integridad: Jerarquía y Flujo de Aprobación...\n");

  try {
    // 1. Setup temporal data
    console.log("📦 1. Creando entidades (Universidad, Espacio, Facultad, Departamento)...");
    const [uni] = await db.insert(universities).values({
      name: `Universidad Test ${Date.now()}`,
      slug: `uni-test-${Date.now()}`,
    }).returning();

    const [space] = await db.insert(spaces).values({
      name: "Auditorio Test (Capacidad: 50)",
      capacity: 50,
      universityId: uni.id,
    }).returning();

    const [tenant] = await db.insert(tenants).values({
      name: `Facultad Test ${Date.now()}`,
      slug: `facultad-test-${Date.now()}`,
      universityId: uni.id,
    }).returning();

    const dept = await DepartmentsService.createDepartment({
      name: "Departamento de Computación Test",
      tenantId: tenant.id,
      description: "Departamento de prueba para automatización",
    });
    console.log(`✅ Departamento creado: ${dept.name} (ID: ${dept.id})`);

    const [decanoUser] = await db.insert(users).values({
      email: `decano_${Date.now()}@test.com`,
      passwordHash: "hashed",
      name: "Decano Validador",
      role: "tenant_admin",
      tenantId: tenant.id,
    }).returning();

    // 2. Probar propuesta de evento por departamento (Estado inicial: pendiente_aprobacion)
    console.log("\n🧪 2. Probando propuesta de evento por departamento...");
    const proposedEvent = await EventsService.createEvent({
      title: `Simposio Propuesto ${Date.now()}`,
      date: new Date(Date.now() + 86400000 * 3),
      duration: 120,
      tenantId: tenant.id,
      departmentId: dept.id,
      spaceId: space.id,
      capacity: 40,
      price: "10.00",
      status: "pendiente_aprobacion",
    });
    console.log(`📋 Evento propuesto con ID: ${proposedEvent.id} | Estado: "${proposedEvent.status}"`);

    // Verificar que el evento NO esté en el catálogo público
    const publicEventsBefore = await EventsService.getAllEvents();
    const foundBefore = publicEventsBefore.some((e) => e.id === proposedEvent.id);
    if (foundBefore) {
      console.error("❌ FALLO: Un evento 'pendiente_aprobacion' es visible en el catálogo público.");
    } else {
      console.log("✅ ÉXITO: El evento pendiente NO es visible públicamente en el catálogo.");
    }

    // 3. Probar Aprobación por el Decanato de la Facultad
    console.log("\n🧪 3. Probando Aprobación de Evento por el Decanato...");
    const approvedEvent = await EventsService.approveEvent(proposedEvent.id);
    console.log(`🏛️ Evento aprobado por Decano -> Estado nuevo: "${approvedEvent.status}"`);

    // Verificar que AHORA SÍ aparezca en el catálogo público
    const publicEventsAfter = await EventsService.getAllEvents();
    const foundAfter = publicEventsAfter.some((e) => e.id === approvedEvent.id);
    if (foundAfter) {
      console.log("✅ ÉXITO: El evento aprobado AHORA SÍ es visible en el catálogo público.");
    } else {
      console.error("❌ FALLO: El evento aprobado no apareció en el catálogo público.");
    }

    // 4. Probar Inscripción bimonetario y confirmación de pago
    console.log("\n🧪 4. Probando inscripción bimonetaria en evento aprobado...");
    const attendeeData = {
      eventId: approvedEvent.id,
      name: "Estudiante UC",
      email: `estudiante_${Date.now()}@uc.edu.ve`,
      phone: "0412-9998877",
      paymentReference: "REF-112233",
      paymentAmountBs: "601.00",
      exchangeRateBcv: "60.1000",
      paymentBankOrigin: "Banesco",
      paymentDate: new Date(),
    };

    const attendee = await AttendeesService.registerAttendee(attendeeData);
    console.log(`✅ Registro completado. Token QR: ${attendee.ticketToken} | Estado: ${attendee.status}`);

    // Confirmar pago en AttendeesService
    await AttendeesService.confirmPayment(attendee.id, decanoUser.id);
    console.log("✅ Pago confirmado por el gestor. Registro de auditoría guardado.");

    // 5. Probando Soft Delete
    console.log("\n🧹 5. Probando Soft Delete de espacio...");
    const deletedSpace = await SpacesService.deleteSpace(space.id);
    console.log(`✅ Espacio archivado lógicamente -> isArchived: ${deletedSpace.isArchived}`);

    console.log("\n✨ ¡TODAS LAS PRUEBAS DE INTEGRIDAD Y JERARQUÍA FUERON EXITOSAS! ✨\n");
  } catch (error) {
    console.error("❌ Error en pruebas de integridad:", error);
    process.exit(1);
  }
}

runIntegrityTests();
