import { db } from "@/db";
import { departments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateUniqueSlug } from "@/lib/slug-helpers";

export class DepartmentsService {
  /**
   * Obtiene los departamentos pertenecientes a una facultad (tenant).
   */
  static async getDepartmentsByTenant(tenantId: string) {
    return await db.query.departments.findMany({
      where: eq(departments.tenantId, tenantId),
      orderBy: (departments, { asc }) => [asc(departments.name)],
    });
  }

  /**
   * Obtiene un departamento por su ID.
   */
  static async getDepartmentById(id: string) {
    return await db.query.departments.findFirst({
      where: eq(departments.id, id),
      with: {
        tenant: true,
      },
    });
  }

  /**
   * Crea un nuevo departamento académico dentro de la facultad.
   */
  static async createDepartment(data: { name: string; tenantId: string; description?: string }) {
    const slug = await generateUniqueSlug("departments", data.name);
    const [newDepartment] = await db.insert(departments).values({
      ...data,
      slug,
    }).returning();
    return newDepartment;
  }
}
