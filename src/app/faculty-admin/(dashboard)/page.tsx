import { db } from "@/db";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { tenants } from "@/db/schema";
import { redirect } from "next/navigation";

export default async function FacultyDashboardPage() {
  const session = await getSession();
  if (!session || !session.tenantId) redirect("/faculty-admin/login");

  const faculty = await db.query.tenants.findFirst({
    where: eq(tenants.id, session.tenantId as string),
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Dashboard de Facultad</h1>
        <p className="text-on-surface-variant text-body-md">
          Bienvenido, administrador de <span className="font-bold text-academic-gold">{faculty?.name || "Facultad"}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-white rounded-3xl p-6 border border-outline-variant shadow-sm flex items-center gap-4">
          <div className="w-16 h-16 bg-university-blue/10 text-university-blue rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">local_activity</span>
          </div>
          <div>
            <p className="text-on-surface-variant font-label-md">Mis Eventos</p>
            <p className="font-headline-lg text-university-blue">Gestionar</p>
          </div>
        </div>
      </div>
    </div>
  );
}
