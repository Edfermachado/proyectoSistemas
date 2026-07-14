import { db } from "./src/db";
import { findTenantBySlugOrId } from "./src/lib/slug-helpers";
import { events as eventsSchema } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function run() {
  const slug = "facultad-de-ciencias-de-la-computacion";
  const tenant = await findTenantBySlugOrId(slug);
  console.log("Tenant:", tenant?.id);
  if (tenant) {
    const evts = await db.select().from(eventsSchema).where(eq(eventsSchema.tenantId, tenant.id));
    console.log("Events:", evts.length);
  }
}
run().catch(console.error).finally(() => process.exit(0));
