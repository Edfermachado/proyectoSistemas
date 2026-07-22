"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";
import { createSession, deleteSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export async function loginFacultyAdmin(prevState: unknown, formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Faltan credenciales" };
  }



  // Find user (tenant_admin)
  const user = await db.query.users.findFirst({
    where: and(
      eq(users.email, email),
      or(eq(users.role, "tenant_admin"), eq(users.role, "event_manager"), eq(users.role, "access_control"))
    ),
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "Credenciales incorrectas o tu cuenta no es de administrador de facultad." };
  }

  await createSession(user.id, user.role, user.tenantId, user.email);
  redirect("/faculty-admin");
}

export async function logoutFacultyAdmin() {
  await deleteSession();
  redirect("/login");
}

export async function loginUser(prevState: unknown, formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Faltan credenciales" };
  }



  // Find user (role: user)
  const user = await db.query.users.findFirst({
    where: and(
      eq(users.email, email),
      eq(users.role, "user")
    ),
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "Correo electrónico o contraseña incorrectos." };
  }

  await createSession(user.id, user.role, user.tenantId, user.email);
  redirect("/");
}

export async function registerUser(prevState: unknown, formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!email || !password || !confirmPassword) {
    return { error: "Todos los campos son obligatorios" };
  }

  if (password !== confirmPassword) {
    return { error: "Las contraseñas no coinciden." };
  }

  // Check if user already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    return { error: "El correo electrónico ya está registrado." };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [newUser] = await db.insert(users).values({
      email,
      passwordHash: hashedPassword,
      role: "user",
      tenantId: null,
    }).returning();

    await createSession(newUser.id, newUser.role, newUser.tenantId, newUser.email);
  } catch (error) {
    console.error("Error registering user:", error);
    return { error: "Hubo un error al registrar la cuenta. Inténtalo de nuevo." };
  }

  redirect("/");
}

export async function loginSuperAdmin(prevState: unknown, formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Faltan credenciales" };
  }

  // Find user (role: superadmin)
  const user = await db.query.users.findFirst({
    where: and(
      eq(users.email, email),
      eq(users.role, "superadmin")
    ),
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "Credenciales de administrador del sistema incorrectas." };
  }

  await createSession(user.id, user.role, user.tenantId, user.email);
  redirect("/admin");
}

export async function logoutAdmin() {
  await deleteSession();
  redirect("/admin/login");
}

export async function logoutUser() {
  await deleteSession();
  redirect("/login");
}

export async function unifiedLoginAction(prevState: unknown, formData: FormData) {
  const roleType = formData.get("roleType");
  if (roleType === "facultad") {
    return await loginFacultyAdmin(prevState, formData);
  } else {
    return await loginUser(prevState, formData);
  }
}
