import { db } from "@/db";
import { spaces } from "@/db/schema";
import { eq } from "drizzle-orm";

export class SpacesService {
  static async getSpacesByTenant(tenantId: string) {
    return await db.query.spaces.findMany({
      where: eq(spaces.tenantId, tenantId),
      orderBy: (spaces, { desc }) => [desc(spaces.createdAt)],
    });
  }

  static async getSpaceById(id: string) {
    return await db.query.spaces.findFirst({
      where: eq(spaces.id, id),
    });
  }

  static async createSpace(data: { name: string; capacity: number; tenantId: string }) {
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
    const [deletedSpace] = await db.delete(spaces)
      .where(eq(spaces.id, id))
      .returning();
    return deletedSpace;
  }
}
