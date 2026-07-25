import { db } from "@/db";
import { spaces, tenants } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export class SpacesService {
  static async getSpacesByTenant(tenantId: string) {
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.id, tenantId),
      columns: { universityId: true }
    });

    if (!tenant?.universityId) return [];

    return await db.query.spaces.findMany({
      where: and(eq(spaces.universityId, tenant.universityId), eq(spaces.isArchived, false)),
      orderBy: (spaces, { desc }) => [desc(spaces.createdAt)],
    });
  }

  static async getSpacesByUniversity(universityId: string) {
    return await db.query.spaces.findMany({
      where: and(eq(spaces.universityId, universityId), eq(spaces.isArchived, false)),
      orderBy: (spaces, { desc }) => [desc(spaces.createdAt)],
    });
  }

  static async getSpaceById(id: string) {
    return await db.query.spaces.findFirst({
      where: eq(spaces.id, id),
    });
  }

  static async createSpace(data: { name: string; capacity: number; universityId: string }) {
    const [newSpace] = await db.insert(spaces).values(data).returning();
    return newSpace;
  }

  static async updateSpace(id: string, data: Partial<{ name: string; capacity: number }>) {
    const [updatedSpace] = await db.update(spaces)
      .set(data)
      .where(eq(spaces.id, id))
      .returning();
    return updatedSpace;
  }

  static async deleteSpace(id: string) {
    const [deletedSpace] = await db.update(spaces)
      .set({ isArchived: true, deletedAt: new Date() })
      .where(eq(spaces.id, id))
      .returning();
    return deletedSpace;
  }
}

