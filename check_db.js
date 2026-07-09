const postgres = require('postgres');
require('dotenv').config();

const connectionString = process.env.DATABASE_URI;

if (!connectionString) {
  throw new Error('❌ Falta la variable de entorno DATABASE_URI en .env');
}

const client = postgres(connectionString);

async function main() {
  try {
    const tables = await client`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log("Tables:", tables);

    const users = await client`SELECT * FROM users LIMIT 1`;
    console.log("Users exist, columns:", Object.keys(users[0] || {}));
  } catch(e) {
    console.error("Postgres error:", e.message);
  } finally {
    process.exit(0);
  }
}
main();
