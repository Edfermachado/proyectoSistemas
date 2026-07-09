const postgres = require('postgres');
require('dotenv').config();

const connectionString = process.env.DATABASE_URI;
if (!connectionString) throw new Error('Missing DATABASE_URI');

const client = postgres(connectionString);

async function main() {
  try {
    console.log("Forzando el borrado de tablas...");
    await client`DROP TABLE IF EXISTS attendees CASCADE;`;
    await client`DROP TABLE IF EXISTS events CASCADE;`;
    await client`DROP TABLE IF EXISTS spaces CASCADE;`;
    await client`DROP TABLE IF EXISTS users CASCADE;`;
    await client`DROP TABLE IF EXISTS tenants CASCADE;`;
    
    // Y también borraremos tablas viejas de Payload por si acaso
    await client`DROP TABLE IF EXISTS payload_preferences CASCADE;`;
    await client`DROP TABLE IF EXISTS payload_preferences_rels CASCADE;`;
    await client`DROP TABLE IF EXISTS payload_migrations CASCADE;`;
    await client`DROP TABLE IF EXISTS users_roles CASCADE;`;
    await client`DROP TABLE IF EXISTS users_sessions CASCADE;`;
    await client`DROP TABLE IF EXISTS payload_locked_documents CASCADE;`;
    await client`DROP TABLE IF EXISTS payload_locked_documents_rels CASCADE;`;
    await client`DROP TABLE IF EXISTS media CASCADE;`;
    
    console.log("Tablas eliminadas con éxito.");
  } catch(e) {
    console.error("Error:", e.message);
  } finally {
    process.exit(0);
  }
}
main();
