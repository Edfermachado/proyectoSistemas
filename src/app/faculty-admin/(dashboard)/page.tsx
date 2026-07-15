import { db } from "@/db";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { tenants } from "@/db/schema";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function FacultyDashboardPage() {
  const session = await getSession();
  if (!session || !session.tenantId) redirect("/login");

  if (session.role === "access_control") {
    redirect("/faculty-admin/scanner");
  }

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
        <Link 
          href="/faculty-admin/events" 
          className="bg-surface-white rounded-3xl p-6 border border-outline-variant shadow-sm flex items-center gap-4 hover:shadow-md hover:border-university-blue/30 transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 bg-university-blue/10 text-university-blue rounded-2xl flex items-center justify-center group-hover:bg-university-blue group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-3xl">local_activity</span>
          </div>
          <div>
            <p className="text-on-surface-variant font-label-md">Mis Eventos</p>
            <p className="font-headline-lg text-university-blue">Gestionar</p>
          </div>
        </Link>
        <Link 
          href="/faculty-admin/calendar" 
          className="bg-surface-white rounded-3xl p-6 border border-outline-variant shadow-sm flex items-center gap-4 hover:shadow-md hover:border-university-blue/30 transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 bg-academic-gold/10 text-academic-gold rounded-2xl flex items-center justify-center group-hover:bg-academic-gold group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-3xl">calendar_month</span>
          </div>
          <div>
            <p className="text-on-surface-variant font-label-md">Programación</p>
            <p className="font-headline-lg text-university-blue">Calendario</p>
          </div>
        </Link>
        <Link 
          href="/faculty-admin/metrics" 
          className="bg-surface-white rounded-3xl p-6 border border-outline-variant shadow-sm flex items-center gap-4 hover:shadow-md hover:border-university-blue/30 transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 bg-innovation-purple/10 text-innovation-purple rounded-2xl flex items-center justify-center group-hover:bg-innovation-purple group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-3xl">bar_chart</span>
          </div>
          <div>
            <p className="text-on-surface-variant font-label-md">Reportes</p>
            <p className="font-headline-lg text-university-blue">Métricas</p>
          </div>
        </Link>
        <Link 
          href="/faculty-admin/requests" 
          className="bg-surface-white rounded-3xl p-6 border border-outline-variant shadow-sm flex items-center gap-4 hover:shadow-md hover:border-university-blue/30 transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-3xl">assignment</span>
          </div>
          <div>
            <p className="text-on-surface-variant font-label-md">Atención</p>
            <p className="font-headline-lg text-university-blue">Solicitudes</p>
          </div>
        </Link>
        {session.role === 'tenant_admin' && (
          <Link 
            href="/faculty-admin/managers" 
            className="bg-surface-white rounded-3xl p-6 border border-outline-variant shadow-sm flex items-center gap-4 hover:shadow-md hover:border-university-blue/30 transition-all cursor-pointer group"
          >
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-3xl">manage_accounts</span>
            </div>
            <div>
              <p className="text-on-surface-variant font-label-md">Cuentas</p>
              <p className="font-headline-lg text-university-blue">Gestores</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
