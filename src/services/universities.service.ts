import { db } from "@/db";
import { universities } from "@/db/schema";
import { eq } from "drizzle-orm";

export class UniversitiesService {
  static async getAllUniversities() {
    return await db.query.universities.findMany({
      orderBy: (universities, { desc }) => [desc(universities.createdAt)],
    });
  }

  static async getUniversityById(id: string) {
    return await db.query.universities.findFirst({
      where: eq(universities.id, id),
    });
  }

  static async createUniversity(data: { name: string; description?: string }) {
    const [newUniv] = await db.insert(universities).values(data).returning();
    return newUniv;
  }

  static async updateUniversity(id: string, data: Partial<{ name: string; description: string }>) {
    const [updatedUniv] = await db.update(universities)
      .set(data)
      .where(eq(universities.id, id))
      .returning();
    return updatedUniv;
  }

  static async deleteUniversity(id: string) {
    const [deletedUniv] = await db.delete(universities)
      .where(eq(universities.id, id))
      .returning();
    return deletedUniv;
  }
}
