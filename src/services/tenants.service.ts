import { db } from "@/db";
import { tenants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateUniqueSlug } from "@/lib/slug-helpers";

export class TenantsService {
  static async getAllTenants() {
    return await db.query.tenants.findMany({
      orderBy: (tenants, { desc }) => [desc(tenants.createdAt)],
    });
  }

  static async getTenantById(id: string) {
    return await db.query.tenants.findFirst({
      where: eq(tenants.id, id),
    });
  }

  static async createTenant(data: { name: string; description?: string; universityId?: string; categoryId?: string }) {
    const slug = await generateUniqueSlug("tenants", data.name);
    const [newTenant] = await db.insert(tenants).values({ ...data, slug }).returning();
    return newTenant;
  }

  static async updateTenant(id: string, data: Partial<{ name: string; description: string; categoryId: string }>) {
    const slugUpdate = data.name ? { slug: await generateUniqueSlug("tenants", data.name, id) } : {};
    const [updatedTenant] = await db.update(tenants)
      .set({ ...data, ...slugUpdate })
      .where(eq(tenants.id, id))
      .returning();
    return updatedTenant;
  }

  static async deleteTenant(id: string) {
    const [deletedTenant] = await db.delete(tenants)
      .where(eq(tenants.id, id))
      .returning();
    return deletedTenant;
  }
}
