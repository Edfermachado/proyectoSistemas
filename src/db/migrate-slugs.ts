import postgres from 'postgres';
import { slugify } from '../lib/slugify.js';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URI!);

async function migrate() {
  // Add slug columns without unique constraint first (data may be null)
  await sql`ALTER TABLE universities ADD COLUMN IF NOT EXISTS slug VARCHAR(300)`;
  await sql`ALTER TABLE tenants ADD COLUMN IF NOT EXISTS slug VARCHAR(300)`;
  await sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS slug VARCHAR(350)`;

  console.log('Columns added. Populating slugs...');

  // Populate existing rows
  const unis = await sql`SELECT id, name FROM universities`;
  for (const u of unis) {
    const slug = slugify(u.name);
    await sql`UPDATE universities SET slug = ${slug} WHERE id = ${u.id}`;
  }

  const tenantsList = await sql`SELECT id, name FROM tenants`;
  for (const t of tenantsList) {
    const slug = slugify(t.name);
    await sql`UPDATE tenants SET slug = ${slug} WHERE id = ${t.id}`;
  }

  const eventsList = await sql`SELECT id, title FROM events`;
  for (const e of eventsList) {
    const slug = slugify(e.title);
    await sql`UPDATE events SET slug = ${slug} WHERE id = ${e.id}`;
  }

  console.log('Slugs populated. Adding unique constraints...');

  // Now add unique constraints
  await sql`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'universities_slug_unique') THEN
        ALTER TABLE universities ADD CONSTRAINT universities_slug_unique UNIQUE (slug);
      END IF;
    END $$
  `;
  await sql`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tenants_slug_unique') THEN
        ALTER TABLE tenants ADD CONSTRAINT tenants_slug_unique UNIQUE (slug);
      END IF;
    END $$
  `;
  await sql`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'events_slug_unique') THEN
        ALTER TABLE events ADD CONSTRAINT events_slug_unique UNIQUE (slug);
      END IF;
    END $$
  `;

  console.log('Migration complete!');
  await sql.end();
}

migrate().catch(console.error);
