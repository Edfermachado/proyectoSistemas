import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URI;

if (!connectionString) {
  throw new Error('❌ Falta la variable de entorno DATABASE_URI en .env');
}

// Inicialización del cliente Postgres
const client = postgres(connectionString, { max: 10 }); // max: 10 conexiones simultáneas
export const db = drizzle(client, { schema });
