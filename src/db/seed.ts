import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import 'dotenv/config';
import bcrypt from 'bcryptjs';

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
    await db.delete(schema.categories);

    console.log('Creando categorías...');
    const [cat1] = await db.insert(schema.categories).values({
      name: 'Tecnología e Innovación',
      slug: 'tecnologia',
      icon: 'computer',
    }).returning();

    const [cat2] = await db.insert(schema.categories).values({
      name: 'Arte y Cultura',
      slug: 'arte',
      icon: 'palette',
    }).returning();

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
      categoryId: cat1.id,
    }).returning();
    
    const [tenant2] = await db.insert(schema.tenants).values({
      name: 'Facultad de Ciencias de la Computación',
      slug: 'facultad-de-ciencias-de-la-computacion',
      description: 'Innovación en inteligencia artificial, ciberseguridad y ciencia de datos.',
      universityId: uni1.id,
      categoryId: cat1.id,
    }).returning();
    
    const [tenant3] = await db.insert(schema.tenants).values({
      name: 'Facultad de Bellas Artes',
      slug: 'facultad-de-bellas-artes',
      description: 'Desarrollo de habilidades en pintura, escultura, cine y medios visuales.',
      universityId: uni2.id,
      categoryId: cat2.id,
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
        price: '0',
        tenantId: tenant1.id,
        spaceId: space1.id,
        imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
      },
      {
        title: 'Hackathon de Inteligencia Artificial',
        slug: 'hackathon-de-inteligencia-artificial',
        description: 'Desafío de 48 horas construyendo soluciones innovadoras usando IA y Machine Learning.',
        date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // En 10 días
        price: '10.00',
        tenantId: tenant2.id,
        spaceId: space2.id,
        imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
      },
      {
        title: 'Exposición de Arte Moderno',
        slug: 'exposicion-de-arte-moderno',
        description: 'Exposición de los mejores trabajos de escultura y pintura de los alumnos de último año.',
        date: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // En 15 días
        price: '5.00',
        tenantId: tenant3.id,
        spaceId: space3.id,
        imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800',
      },
      {
        title: 'Concierto Sinfónico Universitario',
        slug: 'concierto-sinfonico-universitario',
        description: 'La orquesta sinfónica de la facultad interpretará clásicos atemporales y bandas sonoras contemporáneas.',
        date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // En 2 días
        price: '15.00',
        tenantId: tenant3.id,
        spaceId: space3.id,
        imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=800',
      },
      {
        title: 'Congreso Internacional de Ciberseguridad',
        slug: 'congreso-internacional-de-ciberseguridad',
        description: 'Expertos internacionales compartirán las últimas tendencias en protección de datos y hacking ético.',
        date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // En 7 días
        price: '25.00',
        tenantId: tenant2.id,
        spaceId: space2.id,
        imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
      },
      {
        title: 'Feria de Emprendimiento Tecnológico',
        slug: 'feria-de-emprendimiento-tecnologico',
        description: 'Descubre las startups creadas por nuestros estudiantes y conoce a los futuros líderes del mercado.',
        date: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000), // En 12 días
        price: '0',
        tenantId: tenant1.id,
        spaceId: space1.id,
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=800',
      },
      {
        title: 'Taller de Robótica para Principiantes',
        slug: 'taller-de-robotica-para-principiantes',
        description: 'Aprende los conceptos básicos de robótica construyendo tu propio brazo mecánico controlado por Arduino.',
        date: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000), // En 20 días
        price: '0',
        tenantId: tenant1.id,
        spaceId: space2.id,
        imageUrl: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&q=80&w=800',
      },
      {
        title: 'Festival de Cine Estudiantil',
        slug: 'festival-de-cine-estudiantil',
        description: 'Proyección de cortometrajes dirigidos, producidos y actuados por estudiantes de la facultad.',
        date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // En 30 días
        price: '8.00',
        tenantId: tenant3.id,
        spaceId: space3.id,
        imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800',
      }
    ]).returning();

    console.log('Creando usuario root y roles de prueba...');
    await db.insert(schema.users).values({
      email: 'admin@gmail.com',
      passwordHash: await bcrypt.hash('admin', 10),
      role: 'superadmin',
      tenantId: null,
      organizerLevel: 'registrado'
    }).returning();

    await db.insert(schema.users).values({
      email: 'decano@gmail.com',
      passwordHash: await bcrypt.hash('decano', 10),
      role: 'tenant_admin',
      tenantId: tenant1.id,
      organizerLevel: 'registrado'
    }).returning();

    await db.insert(schema.users).values({
      email: 'gestor@gmail.com',
      passwordHash: await bcrypt.hash('gestor', 10),
      role: 'event_manager',
      tenantId: tenant1.id,
      organizerLevel: 'registrado'
    }).returning();

    await db.insert(schema.users).values({
      email: 'portero@gmail.com',
      passwordHash: await bcrypt.hash('portero123', 10),
      role: 'access_control',
      tenantId: tenant1.id,
      organizerLevel: 'registrado'
    }).returning();

    const [regularUser] = await db.insert(schema.users).values({
      email: 'estudiante@gmail.com',
      passwordHash: await bcrypt.hash('123456', 10),
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

    console.log('\n--- DATOS PARA INICIO DE SESIÓN ---');
    console.log(`👑 Superadmin (/admin): admin@gmail.com (admin)`);
    console.log(`🏛️ Decano Facultad (/faculty-admin): decano@gmail.com (decano)`);
    console.log(`📅 Gestor de Eventos (/faculty-admin): gestor@gmail.com (gestor)`);
    console.log(`💂 Control de Acceso (/faculty-admin): portero@gmail.com (portero123)`);
    console.log(`👤 Usuario regular (/): estudiante@gmail.com (123456)`);
    console.log('\n--- DATOS PARA PRUEBA DE ESCÁNER QR ---');
    console.log(`🔑 QR Válido (Evento Gratis): ${attendeeFree.ticketToken}`);
    console.log(`⏳ QR Pendiente (Evento Pago): ${attendeePaid.ticketToken}`);
    console.log('----------------------------------------\n');

    console.log('✅ Seeder completado con éxito!');
  } catch (error) {
    console.error('❌ Error durante el seeder:', error);
  } finally {
    process.exit(0);
  }
}

main();
