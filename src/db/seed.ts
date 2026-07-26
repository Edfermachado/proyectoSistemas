import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import postgres from 'postgres';
import * as schema from './schema';
import 'dotenv/config';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URI;
if (!connectionString) {
  throw new Error('❌ Falta la variable de entorno DATABASE_URI en .env');
}

const client = postgres(connectionString, { max: 1, prepare: false });
const db = drizzle(client, { schema });

async function main() {
  console.log('🌱 Iniciando seeder con jerarquía UC -> FACYT -> DEPARTAMENTOS...');
  try {
    console.log('🛠️ 0. Aplicando esquema DDL (Creando tabla departments y columnas si no existen)...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "departments" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(255) NOT NULL,
        "slug" varchar(300) UNIQUE,
        "description" text,
        "tenant_id" uuid NOT NULL REFERENCES "tenants"("id"),
        "created_at" timestamp DEFAULT now()
      );
      ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "department_id" uuid REFERENCES "departments"("id");
      ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "department_id" uuid REFERENCES "departments"("id");
    `);

    console.log('🧹 Limpiando base de datos (borrando registros previos)...');
    await db.delete(schema.scanLogs);
    await db.delete(schema.paymentAuditLogs);
    await db.delete(schema.eventRequests);
    await db.delete(schema.attendees);
    await db.delete(schema.events);
    await db.delete(schema.users);
    await db.delete(schema.departments);
    await db.delete(schema.spaces);
    await db.delete(schema.tenants);
    await db.delete(schema.universities);
    await db.delete(schema.categories);

    console.log('🏷️ 1. Creando Categoría Principal...');
    const [cat1] = await db.insert(schema.categories).values({
      name: 'Ciencia y Tecnología',
      slug: 'ciencia-y-tecnologia',
      icon: 'cpu',
    }).returning();

    console.log('🏫 2. Creando Universidad de Carabobo...');
    const [uni] = await db.insert(schema.universities).values({
      name: 'Universidad de Carabobo (UC)',
      slug: 'universidad-de-carabobo',
      description: 'Alma Mater del estado Carabobo, centro de excelencia académica, ciencia e innovación en Bárbula.',
    }).returning();

    console.log('🏢 3. Creando Facultad FACYT (Tenant)...');
    const [tenant] = await db.insert(schema.tenants).values({
      name: 'Facultad Experimental de Ciencias y Tecnología (FACYT)',
      slug: 'facyt-uc',
      description: 'Facultad dedicada a la formación de investigadores en computación, química, biología, física y matemática.',
      universityId: uni.id,
      categoryId: cat1.id,
    }).returning();

    console.log('🧪 4. Creando Departamentos Académicos de FACYT...');
    const [deptComp] = await db.insert(schema.departments).values({
      name: 'Departamento de Computación',
      slug: 'departamento-de-computacion-facyt',
      description: 'Departamento de desarrollo de software, inteligencia artificial y arquitectura de sistemas.',
      tenantId: tenant.id,
    }).returning();

    const [deptQuim] = await db.insert(schema.departments).values({
      name: 'Departamento de Química',
      slug: 'departamento-de-quimica-facyt',
      description: 'Investigación en química orgánica, bioanálisis y nanotecnología.',
      tenantId: tenant.id,
    }).returning();

    console.log('🏟️ 5. Creando Espacio Físico...');
    const [space] = await db.insert(schema.spaces).values({
      name: 'Auditorio de FACYT - Campus Bárbula',
      capacity: 350,
      universityId: uni.id,
    }).returning();

    console.log('👥 6. Creando Usuarios por Rol y Jerarquía...');
    const [superadminUser] = await db.insert(schema.users).values({
      name: 'Super Administrador Central',
      email: 'admin@gmail.com',
      passwordHash: await bcrypt.hash('admin', 10),
      role: 'superadmin',
      tenantId: null,
      departmentId: null,
      organizerLevel: 'registrado'
    }).returning();

    const [decanoUser] = await db.insert(schema.users).values({
      name: 'Decano de FACYT',
      email: 'decano@gmail.com',
      passwordHash: await bcrypt.hash('decano', 10),
      role: 'tenant_admin',
      tenantId: tenant.id,
      departmentId: null,
      organizerLevel: 'registrado'
    }).returning();

    const [gestorUser] = await db.insert(schema.users).values({
      name: 'Jefe / Gestor de Computación',
      email: 'gestor@gmail.com',
      passwordHash: await bcrypt.hash('gestor', 10),
      role: 'event_manager',
      tenantId: tenant.id,
      departmentId: deptComp.id,
      organizerLevel: 'registrado'
    }).returning();

    const [porteroUser] = await db.insert(schema.users).values({
      name: 'Portero / Control de Acceso',
      email: 'portero@gmail.com',
      passwordHash: await bcrypt.hash('portero123', 10),
      role: 'access_control',
      tenantId: tenant.id,
      departmentId: deptComp.id,
      organizerLevel: 'registrado'
    }).returning();

    const [studentUser] = await db.insert(schema.users).values({
      name: 'Estudiante Prueba UC',
      email: 'estudiante@gmail.com',
      passwordHash: await bcrypt.hash('123456', 10),
      role: 'user',
      organizerLevel: 'registrado'
    }).returning();

    console.log('📅 7. Creando Eventos Propuestos por Departamentos...');
    const now = new Date();

    // Evento 1: Aprobado (Depto Computación)
    const [eventApproved] = await db.insert(schema.events).values({
      title: 'Expo de Proyectos de Software FACYT 2026',
      slug: 'expo-proyectos-software-facyt-2026',
      description: 'Muestra anual de sistemas y prototipos creados por estudiantes de Computación.',
      date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      duration: 120,
      price: '0',
      tenantId: tenant.id,
      departmentId: deptComp.id,
      spaceId: space.id,
      capacity: 300,
      status: 'aprobado',
      managerId: gestorUser.id,
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    }).returning();

    // Evento 2: PENDIENTE DE APROBACIÓN POR EL DECANO (Depto Computación)
    const [eventPending] = await db.insert(schema.events).values({
      title: 'Simposio Internacional de Inteligencia Artificial',
      slug: 'simposio-inteligencia-artificial-facyt',
      description: 'Propuesta de simposio sobre IA generativa. Pendiente de aprobación por el Decanato.',
      date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      duration: 240,
      price: '15.00',
      tenantId: tenant.id,
      departmentId: deptComp.id,
      spaceId: space.id,
      capacity: 250,
      status: 'pendiente_aprobacion',
      managerId: gestorUser.id,
      paymentPhone: '04121234567',
      paymentId: '29876543',
      paymentBank: 'Banco de Venezuela',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
    }).returning();

    // Evento 3: Aprobado (Depto Química)
    const [eventQuim] = await db.insert(schema.events).values({
      title: 'Jornadas de Investigación en Química Aplicada',
      slug: 'jornadas-investigacion-quimica-aplicada',
      description: 'Conferencias sobre análisis químico y nanotecnología.',
      date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      duration: 180,
      price: '10.00',
      tenantId: tenant.id,
      departmentId: deptQuim.id,
      spaceId: space.id,
      capacity: 100,
      status: 'aprobado',
      managerId: gestorUser.id,
      paymentPhone: '04121234567',
      paymentId: '29876543',
      paymentBank: 'Mercantil',
      imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    }).returning();

    console.log('🎟️ 8. Inscribiendo Estudiante y Generando Entradas QR...');

    // Ticket 1: Confirmado (Listo para prueba de escáner en puerta por el Portero)
    const [ticketFree] = await db.insert(schema.attendees).values({
      eventId: eventApproved.id,
      userId: studentUser.id,
      name: 'Estudiante Prueba UC',
      email: studentUser.email,
      phone: '+58 412 1112233',
      status: 'confirmado',
      attendeeType: 'estudiante',
      paymentAmountBs: '0.00',
      exchangeRateBcv: '60.1000'
    }).returning();

    // Ticket 2: Pago Pendiente (Listo para comprobación por el Gestor de Computación)
    const [ticketPaidPending] = await db.insert(schema.attendees).values({
      eventId: eventQuim.id,
      userId: studentUser.id,
      name: 'Estudiante Prueba UC',
      email: studentUser.email,
      phone: '+58 412 1112233',
      status: 'pago_pendiente',
      paymentReference: 'PM-99887766',
      paymentScreenshotUrl: 'https://placehold.co/600x400/png?text=Comprobante+Pago+Movil',
      paymentAmountBs: '601.00',
      exchangeRateBcv: '60.1000',
      attendeeType: 'estudiante'
    }).returning();

    // Ticket 3: Confirmado y Ya Escaneado (En Evento 1 - Expo)
    const [ticketScanned] = await db.insert(schema.attendees).values({
      eventId: eventApproved.id,
      userId: studentUser.id,
      name: 'Estudiante Escaneado',
      email: 'estudiante_escaneado@gmail.com',
      phone: '+58 412 1112244',
      status: 'confirmado',
      scannedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      paymentAmountBs: '0.00',
      exchangeRateBcv: '60.1000',
      attendeeType: 'estudiante'
    }).returning();

    await db.insert(schema.scanLogs).values({
      eventId: eventQuim.id,
      attendeeId: ticketScanned.id,
      scannedBy: porteroUser.id,
      scannedAt: ticketScanned.scannedAt
    });

    console.log('\n======================================================');
    console.log('🚀 SEEDER JERÁRQUICO COMPLETADO CON ÉXITO');
    console.log('======================================================');
    console.log(`🏫 Universidad: ${uni.name}`);
    console.log(`🏢 Facultad:    ${tenant.name}`);
    console.log(`🧪 Departamentos: 1) ${deptComp.name} | 2) ${deptQuim.name}`);
    console.log('------------------------------------------------------');
    console.log('🔐 CREDENCIALES DE ACCESO POR ROL:');
    console.log(`👑 1. Superadmin:      admin@gmail.com      | Clave: admin`);
    console.log(`🏛️ 2. Decano FACYT:    decano@gmail.com     | Clave: decano (Aprueba eventos de depto en /faculty-admin/requests)`);
    console.log(`📅 3. Gestor Depto:    gestor@gmail.com     | Clave: gestor (Propone eventos y aprueba pagos)`);
    console.log(`💂 4. Portero Puerta:  portero@gmail.com    | Clave: portero123 (Escanea entradas en /faculty-admin/scanner)`);
    console.log(`👤 5. Usuario Alumno:  estudiante@gmail.com  | Clave: 123456`);
    console.log('------------------------------------------------------');
    console.log('🎟️ TOKENS DE ENTRADAS QR PARA PRUEBAS:');
    console.log(`✅ Ticket Válido (Confirmado):    ${ticketFree.ticketToken}`);
    console.log(`⏳ Ticket Pago Pendiente:         ${ticketPaidPending.ticketToken}`);
    console.log(`⚡ Ticket Ya Escaneado (Puntos):  ${ticketScanned.ticketToken}`);
    console.log('======================================================\n');

  } catch (error) {
    console.error('❌ Error ejecutando seeder:', error);
  } finally {
    await client.end();
    process.exit(0);
  }
}

main();
