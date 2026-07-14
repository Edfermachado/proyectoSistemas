import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URI;
if (!connectionString) {
  throw new Error('❌ Falta la variable de entorno DATABASE_URI en .env');
}

const client = postgres(connectionString, { max: 1 });
const db = drizzle(client, { schema });

async function main() {
  console.log('🌱 Iniciando seeder...');
  try {
    console.log('Limpiando base de datos (borrando datos anteriores)...');
    await db.delete(schema.attendees);
    await db.delete(schema.events);
    await db.delete(schema.spaces);
    await db.delete(schema.users);
    await db.delete(schema.tenants);
    await db.delete(schema.universities);

    console.log('Creando universidades...');
    const [uni1] = await db.insert(schema.universities).values({
      name: 'Universidad Central de Tecnología',
      slug: 'universidad-central-de-tecnologia',
      description: 'Una universidad enfocada en tecnología e innovación. Cuenta con los laboratorios más avanzados de la región.',
    }).returning();
    
    const [uni2] = await db.insert(schema.universities).values({
      name: 'Universidad Nacional de Artes',
      slug: 'universidad-nacional-de-artes',
      description: 'Cuna de la creatividad y la expresión artística, donde convergen las ideas clásicas y contemporáneas.',
    }).returning();

    console.log('Creando facultades (tenants)...');
    const [tenant1] = await db.insert(schema.tenants).values({
      name: 'Facultad de Ingeniería',
      slug: 'facultad-de-ingenieria',
      description: 'Dedicada a la ingeniería, robótica y desarrollo de software moderno.',
      universityId: uni1.id,
    }).returning();
    
    const [tenant2] = await db.insert(schema.tenants).values({
      name: 'Facultad de Ciencias de la Computación',
      slug: 'facultad-de-ciencias-de-la-computacion',
      description: 'Innovación en inteligencia artificial, ciberseguridad y ciencia de datos.',
      universityId: uni1.id,
    }).returning();
    
    const [tenant3] = await db.insert(schema.tenants).values({
      name: 'Facultad de Bellas Artes',
      slug: 'facultad-de-bellas-artes',
      description: 'Desarrollo de habilidades en pintura, escultura, cine y medios visuales.',
      universityId: uni2.id,
    }).returning();

    console.log('Creando espacios...');
    const [space1] = await db.insert(schema.spaces).values({
      name: 'Auditorio Principal Tech',
      capacity: 500,
      tenantId: tenant1.id,
    }).returning();
    
    const [space2] = await db.insert(schema.spaces).values({
      name: 'Laboratorio de IA y Robótica',
      capacity: 50,
      tenantId: tenant2.id,
    }).returning();
    
    const [space3] = await db.insert(schema.spaces).values({
      name: 'Galería de Arte Central',
      capacity: 200,
      tenantId: tenant3.id,
    }).returning();

    console.log('Creando eventos...');
    const now = new Date();
    
    const eventsInserted = await db.insert(schema.events).values([
      {
        title: 'Expo de Ingeniería 2026',
        slug: 'expo-de-ingenieria-2026',
        description: 'Muestra anual de proyectos de ingeniería y robótica presentados por los alumnos.',
        date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // En 5 días
        price: 'GRATIS',
        tenantId: tenant1.id,
        spaceId: space1.id,
      },
      {
        title: 'Hackathon de Inteligencia Artificial',
        slug: 'hackathon-de-inteligencia-artificial',
        description: 'Desafío de 48 horas construyendo soluciones innovadoras usando IA y Machine Learning.',
        date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // En 10 días
        price: '10.00',
        tenantId: tenant2.id,
        spaceId: space2.id, 
      },
      {
        title: 'Exposición de Arte Moderno',
        slug: 'exposicion-de-arte-moderno',
        description: 'Exposición de los mejores trabajos de escultura y pintura de los alumnos de último año.',
        date: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // En 15 días
        price: '5.00',
        tenantId: tenant3.id,
        spaceId: space3.id,
      }
    ]).returning();

    console.log('Creando usuario root y roles de prueba...');
    const [superadmin] = await db.insert(schema.users).values({
      email: 'admin@gmail.com',
      passwordHash: 'admin',
      role: 'superadmin',
      tenantId: tenant1.id, // For faculty portal fallback
      organizerLevel: 'registrado'
    }).returning();

    const [accessControl] = await db.insert(schema.users).values({
      email: 'portero@gmail.com',
      passwordHash: 'portero123',
      role: 'access_control',
      tenantId: tenant1.id,
      organizerLevel: 'registrado'
    }).returning();

    const [regularUser] = await db.insert(schema.users).values({
      email: 'estudiante@gmail.com',
      passwordHash: '123456',
      role: 'user',
      organizerLevel: 'registrado'
    }).returning();

    console.log('Inscribiendo estudiante en eventos (Generando QRs)...');
    
    // Inscribir en evento GRATIS (status: confirmado automático)
    const [attendeeFree] = await db.insert(schema.attendees).values({
      eventId: eventsInserted[0].id,
      userId: regularUser.id,
      name: 'Estudiante Prueba',
      email: regularUser.email,
      phone: '+58 412 0000000',
      status: 'confirmado',
      attendeeType: 'estudiante'
    }).returning();

    // Inscribir en evento PAGO (status: pago_pendiente)
    const [attendeePaid] = await db.insert(schema.attendees).values({
      eventId: eventsInserted[1].id,
      userId: regularUser.id,
      name: 'Estudiante Prueba',
      email: regularUser.email,
      phone: '+58 412 0000000',
      status: 'pago_pendiente',
      attendeeType: 'estudiante'
    }).returning();

    console.log('\n--- DATOS PARA PRUEBA DE ESCÁNER QR ---');
    console.log(`🔑 QR Válido (Evento Gratis): ${attendeeFree.ticketToken}`);
    console.log(`⏳ QR Pendiente (Evento Pago): ${attendeePaid.ticketToken}`);
    console.log(`👤 Usuario de prueba: estudiante@gmail.com (123456)`);
    console.log(`💂 Control de Acceso: portero@gmail.com (portero123)`);
    console.log('----------------------------------------\n');

    console.log('✅ Seeder completado con éxito!');
  } catch (error) {
    console.error('❌ Error durante el seeder:', error);
  } finally {
    process.exit(0);
  }
}

main();
