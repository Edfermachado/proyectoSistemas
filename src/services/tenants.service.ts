import { db } from "@/db";
import { tenants } from "@/db/schema";
import { eq } from "drizzle-orm";

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

  static async createTenant(data: { name: string; description?: string; universityId?: string }) {
    const [newTenant] = await db.insert(tenants).values(data).returning();
    return newTenant;
  }

  static async updateTenant(id: string, data: Partial<{ name: string; description: string }>) {
    const [updatedTenant] = await db.update(tenants)
      .set(data)
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
