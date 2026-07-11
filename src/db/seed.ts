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
      description: 'Una universidad enfocada en tecnología e innovación. Cuenta con los laboratorios más avanzados de la región.',
    }).returning();
    
    const [uni2] = await db.insert(schema.universities).values({
      name: 'Universidad Nacional de Artes',
      description: 'Cuna de la creatividad y la expresión artística, donde convergen las ideas clásicas y contemporáneas.',
    }).returning();

    console.log('Creando facultades (tenants)...');
    const [tenant1] = await db.insert(schema.tenants).values({
      name: 'Facultad de Ingeniería',
      description: 'Dedicada a la ingeniería, robótica y desarrollo de software moderno.',
      universityId: uni1.id,
    }).returning();
    
    const [tenant2] = await db.insert(schema.tenants).values({
      name: 'Facultad de Ciencias de la Computación',
      description: 'Innovación en inteligencia artificial, ciberseguridad y ciencia de datos.',
      universityId: uni1.id,
    }).returning();
    
    const [tenant3] = await db.insert(schema.tenants).values({
      name: 'Facultad de Bellas Artes',
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
    
    await db.insert(schema.events).values([
      {
        title: 'Expo de Ingeniería 2026',
        description: 'Muestra anual de proyectos de ingeniería y robótica presentados por los alumnos.',
        date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // En 5 días
        price: 'FREE',
        tenantId: tenant1.id,
        spaceId: space1.id,
      },
      {
        title: 'Hackathon de Inteligencia Artificial',
        description: 'Desafío de 48 horas construyendo soluciones innovadoras usando IA y Machine Learning.',
        date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // En 10 días
        price: '$10.00',
        tenantId: tenant2.id,
        spaceId: space2.id, 
      },
      {
        title: 'Exposición de Arte Moderno',
        description: 'Exposición de los mejores trabajos de escultura y pintura de los alumnos de último año.',
        date: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // En 15 días
        price: '$5.00',
        tenantId: tenant3.id,
        spaceId: space3.id,
      }
    ]);

    console.log('✅ Seeder completado con éxito!');
  } catch (error) {
    console.error('❌ Error durante el seeder:', error);
  } finally {
    process.exit(0);
  }
}

main();
