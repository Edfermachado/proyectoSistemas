"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { createSession, deleteSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginFacultyAdmin(prevState: any, formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Faltan credenciales" };
  }

  // Find user (tenant_admin)
  const user = await db.query.users.findFirst({
    where: and(
      eq(users.email, email),
      eq(users.passwordHash, password), // Simple auth para este prototipo
      eq(users.role, "tenant_admin")
    ),
  });

  if (!user) {
    return { error: "Credenciales incorrectas o tu cuenta no es de administrador de facultad." };
  }

  await createSession(user.id, user.role, user.tenantId, user.email);
  redirect("/faculty-admin");
}

export async function logoutFacultyAdmin() {
  await deleteSession();
  redirect("/faculty-admin/login");
}
