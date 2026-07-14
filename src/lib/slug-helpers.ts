import { db } from "@/db";
import { universities, tenants, events, categories } from "@/db/schema";
import { or, eq } from "drizzle-orm";
import { slugify } from "@/lib/slugify";

/** Check if a string looks like a UUID (v4) */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUUID = (s: string) => UUID_REGEX.test(s);

/**
 * Finds a university by slug (falling back to ID for backwards compat).
 */
export async function findUniversityBySlugOrId(slugOrId: string) {
  const where = isUUID(slugOrId)
    ? or(eq(universities.slug, slugOrId), eq(universities.id, slugOrId))
    : eq(universities.slug, slugOrId);

  return db.query.universities.findFirst({
    where,
    with: {
      tenants: {
        orderBy: (t, { desc }) => [desc(t.createdAt)]
      }
    }
  });
}

/**
 * Finds a tenant (faculty) by slug (falling back to ID).
 */
export async function findTenantBySlugOrId(slugOrId: string) {
  const where = isUUID(slugOrId)
    ? or(eq(tenants.slug, slugOrId), eq(tenants.id, slugOrId))
    : eq(tenants.slug, slugOrId);
  return db.query.tenants.findFirst({ where, with: { university: true } });
}

/**
 * Finds an event by slug (falling back to ID).
 */
export async function findEventBySlugOrId(slugOrId: string) {
  const where = isUUID(slugOrId)
    ? or(eq(events.slug, slugOrId), eq(events.id, slugOrId))
    : eq(events.slug, slugOrId);
  return db.query.events.findFirst({
    where,
    with: { space: true, tenant: { with: { university: true } } }
  });
}

/**
 * Finds a category by slug (falling back to ID).
 */
export async function findCategoryBySlugOrId(slugOrId: string) {
  const where = isUUID(slugOrId)
    ? or(eq(categories.slug, slugOrId), eq(categories.id, slugOrId))
    : eq(categories.slug, slugOrId);
  return db.query.categories.findFirst({ where });
}

/**
 * Generates a unique slug for an entity, appending a suffix if a collision exists.
 */
export async function generateUniqueSlug(
  table: "universities" | "tenants" | "events" | "categories",
  name: string,
  currentId?: string
): Promise<string> {
  const base = slugify(name);

  const checkSlug = async (slug: string): Promise<boolean> => {
    let existing: { id: string } | undefined;
    if (table === "universities") {
      existing = (await db.query.universities.findFirst({ where: eq(universities.slug, slug) })) ?? undefined;
    } else if (table === "tenants") {
      existing = (await db.query.tenants.findFirst({ where: eq(tenants.slug, slug) })) ?? undefined;
    } else if (table === "categories") {
      // Need to import categories above!
      existing = (await db.query.categories.findFirst({ where: eq(categories.slug, slug) })) ?? undefined;
    } else {
      existing = (await db.query.events.findFirst({ where: eq(events.slug, slug) })) ?? undefined;
    }
    if (!existing) return true;
    if (currentId && existing.id === currentId) return true;
    return false;
  };

  if (await checkSlug(base)) return base;

  for (let i = 2; i <= 20; i++) {
    const candidate = `${base}-${i}`;
    if (await checkSlug(candidate)) return candidate;
  }

  return `${base}-${Date.now().toString(36)}`;
}
