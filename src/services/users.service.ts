import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export class UsersService {
  static async getUsersByTenant(tenantId: string) {
    return await db.query.users.findMany({
      where: eq(users.tenantId, tenantId),
      orderBy: (users, { desc }) => [desc(users.createdAt)],
    });
  }

  static async getUserById(id: string) {
    return await db.query.users.findFirst({
      where: eq(users.id, id),
    });
  }

  static async createUser(data: { email: string; passwordHash: string; role?: string; tenantId?: string }) {
    const [newUser] = await db.insert(users).values(data).returning();
    return newUser;
  }

  static async updateUser(id: string, data: Partial<{ email: string; role: string; tenantId: string }>) {
    const [updatedUser] = await db.update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  static async deleteUser(id: string) {
    const [deletedUser] = await db.delete(users)
      .where(eq(users.id, id))
      .returning();
    return deletedUser;
  }
}
