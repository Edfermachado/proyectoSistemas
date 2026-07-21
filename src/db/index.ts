import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URI;

if (!connectionString) {
  throw new Error('❌ Falta la variable de entorno DATABASE_URI en .env');
}

// Inicialización del cliente Postgres
const client = postgres(connectionString, { max: 10, prepare: false }); // prepare: false es REQUERIDO para Transaction Pooler de Supabase (puerto 6543)
export const db = drizzle(client, { schema });
