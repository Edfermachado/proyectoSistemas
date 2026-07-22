import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { events, attendees, scanLogs, eventRequests, spaces, users, tenants, universities, categories } from "@/db/schema";
import { ne } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "superadmin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const type = body.type;

    // Eliminamos siempre respetando jerarquía de abajo hacia arriba (Bottom-Up) para no romper Foreign Keys
    if (type === "attendees" || type === "events" || type === "all" || type === "seed") {
      // 1. Logs de escaneo (Dependen de attendees y events)
      await db.delete(scanLogs);
      
      // 2. Asistentes (Dependen de events)
      await db.delete(attendees);
    }

    if (type === "events" || type === "all" || type === "seed") {
      // 3. Solicitudes de Eventos (Dependen de events)
      await db.delete(eventRequests);
      
      // 4. Eventos (Dependen de spaces y tenants)
      await db.delete(events);
    }

    if (type === "all" || type === "seed") {
      // 5. Espacios (Dependen de tenants)
      await db.delete(spaces);
      
      // 6. Eliminar usuarios (Solo eliminamos los usuarios regulares o gestores, mantenemos al superadmin)
      // Mantenemos al root (admin@gmail.com o rol superadmin)
      await db.delete(users).where(ne(users.role, "superadmin"));
    }

    if (type === "seed") {
      // 7. Facultades (Tenants)
      await db.delete(tenants);

      // 8. Universidades y Categorías
      await db.delete(universities);
      await db.delete(categories);
    }

    return NextResponse.json({ success: true, message: "Limpieza ejecutada" });
  } catch (error: unknown) {
    console.error("Cleanup Error:", error);
    return NextResponse.json({ error: "Error interno al limpiar base de datos" }, { status: 500 });
  }
}
