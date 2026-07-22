import { db } from "@/db";
import { users, events, tenants, universities, eventRequests } from "@/db/schema";
import { count, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SuperadminMetricsPage() {
  const session = await getSession();
  if (!session || session.role !== "superadmin") redirect("/admin/login");

  const [totalUsers] = await db.select({ value: count() }).from(users);
  const [totalEvents] = await db.select({ value: count() }).from(events);
  const [totalUniversities] = await db.select({ value: count() }).from(universities);
  const [totalFaculties] = await db.select({ value: count() }).from(tenants);
  const [totalRequests] = await db.select({ value: count() }).from(eventRequests);
  
  const attendeesResult = await db.execute(sql`
    SELECT 
      COUNT(id) as value,
      SUM(CASE WHEN attendee_type = 'estudiante' THEN 1 ELSE 0 END) as estudiantes,
      SUM(CASE WHEN attendee_type = 'foraneo' THEN 1 ELSE 0 END) as foraneos
    FROM attendees
  `);
  
  const totalAttendeesValue = Number(attendeesResult[0]?.value) || 0;
  const totalEstudiantes = Number(attendeesResult[0]?.estudiantes) || 0;
  const totalForaneos = Number(attendeesResult[0]?.foraneos) || 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Inteligencia Global</h1>
          <p className="text-on-surface-variant text-body-md">
            Métricas estratégicas y de crecimiento de toda la red universitaria.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-university-blue to-innovation-purple rounded-3xl p-8 text-white shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <span className="material-symbols-outlined text-4xl mb-4 opacity-80">hub</span>
          <h3 className="text-white/80 font-bold uppercase tracking-widest text-xs mb-1">Red Académica</h3>
          <p className="text-5xl font-black">{totalUniversities.value}</p>
          <p className="text-sm mt-2 opacity-90">Universidades Activas</p>
          <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center text-sm">
            <span>Facultades (Tenants)</span>
            <span className="font-bold text-lg">{totalFaculties.value}</span>
          </div>
        </div>

        <div className="bg-surface-white rounded-3xl p-8 border border-outline-variant shadow-sm relative overflow-hidden group hover:border-academic-gold transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-academic-gold/10 rounded-bl-[100px] transition-transform duration-500 group-hover:scale-110"></div>
          <span className="material-symbols-outlined text-4xl mb-4 text-academic-gold">event_available</span>
          <h3 className="text-on-surface-variant font-bold uppercase tracking-widest text-xs mb-1">Operaciones</h3>
          <p className="text-5xl font-black text-university-blue">{totalEvents.value}</p>
          <p className="text-sm mt-2 text-on-surface-variant">Eventos Publicados</p>
          <div className="mt-4 pt-4 border-t border-outline-variant flex justify-between items-center text-sm">
            <span className="text-on-surface-variant">Solicitudes B2B</span>
            <span className="font-bold text-lg text-university-blue">{totalRequests.value}</span>
          </div>
        </div>

        <div className="bg-surface-white rounded-3xl p-8 border border-outline-variant shadow-sm relative overflow-hidden group hover:border-innovation-purple transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-innovation-purple/10 rounded-bl-[100px] transition-transform duration-500 group-hover:scale-110"></div>
          <div className="flex justify-between">
            <span className="material-symbols-outlined text-4xl mb-4 text-innovation-purple">groups</span>
            <div className="text-right flex gap-3 text-xs bg-surface-container-lowest border border-outline-variant rounded-xl p-2 z-10 relative">
                 <div>
                   <p className="text-on-surface-variant">Estudiantes</p>
                   <p className="font-bold text-university-blue">{totalEstudiantes}</p>
                 </div>
                 <div className="w-px bg-outline-variant"></div>
                 <div>
                   <p className="text-on-surface-variant">Foráneos</p>
                   <p className="font-bold text-innovation-purple">{totalForaneos}</p>
                 </div>
            </div>
          </div>
          
          <h3 className="text-on-surface-variant font-bold uppercase tracking-widest text-xs mb-1">Adquisición</h3>
          <p className="text-5xl font-black text-university-blue">{totalAttendeesValue}</p>
          <p className="text-sm mt-2 text-on-surface-variant">Entradas Generadas</p>
          <div className="mt-4 pt-4 border-t border-outline-variant flex justify-between items-center text-sm">
            <span className="text-on-surface-variant">Usuarios Totales</span>
            <span className="font-bold text-lg text-university-blue">{totalUsers.value}</span>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-surface-white rounded-3xl border border-outline-variant shadow-sm p-8">
        <h3 className="font-headline-md text-university-blue mb-6">Estado del Sistema Comercial</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center text-success">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <div>
              <p className="font-bold text-on-surface">Motor de Reservas B2C</p>
              <p className="text-sm text-on-surface-variant">Las inscripciones a eventos están funcionando y mapeadas en la BD.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center text-success">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <div>
              <p className="font-bold text-on-surface">Solicitudes Comerciales (Patrocinios)</p>
              <p className="text-sm text-on-surface-variant">Esquemas polimórficos de Zod operando con Fail-Fast Security.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center text-warning">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <div>
              <p className="font-bold text-on-surface">Pasarela de Pagos Stripe</p>
              <p className="text-sm text-on-surface-variant">Pendiente de integración. Los eventos comerciales muestran status "pago_pendiente".</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
