import { db } from "@/db";
import { events, spaces } from "@/db/schema";
import { count, eq, sql } from "drizzle-orm";
import { tenants } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function FacultyMetricsPage() {
  const session = await getSession();
  if (!session || session.role !== "tenant_admin") redirect("/login");

  const facultyId = session.tenantId as string;

  const [totalEvents] = await db.select({ value: count() }).from(events).where(eq(events.tenantId, facultyId));
  
  const faculty = await db.query.tenants.findFirst({
    where: eq(tenants.id, facultyId),
    columns: { universityId: true }
  });
  
  const totalSpacesResult = faculty?.universityId 
    ? await db.select({ value: count() }).from(spaces).where(eq(spaces.universityId, faculty.universityId))
    : [{ value: 0 }];
  const totalSpaces = totalSpacesResult[0] || { value: 0 };
  
  const attendeesResult = await db.execute(sql`
    SELECT 
      COUNT(a.id) as value,
      SUM(CASE WHEN a.attendee_type = 'estudiante' THEN 1 ELSE 0 END) as estudiantes,
      SUM(CASE WHEN a.attendee_type = 'foraneo' THEN 1 ELSE 0 END) as foraneos
    FROM attendees a
    INNER JOIN events e ON a.event_id = e.id
    WHERE e.tenant_id = ${facultyId}
  `);
  
  const requestsResult = await db.execute(sql`
    SELECT COUNT(r.id) as value
    FROM event_requests r
    INNER JOIN events e ON r.event_id = e.id
    WHERE e.tenant_id = ${facultyId}
  `);

  const totalAttendeesValue = Number(attendeesResult[0]?.value) || 0;
  const totalEstudiantes = Number(attendeesResult[0]?.estudiantes) || 0;
  const totalForaneos = Number(attendeesResult[0]?.foraneos) || 0;
  const totalRequestsValue = Number(requestsResult[0]?.value) || 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Métricas Estratégicas</h1>
          <p className="text-on-surface-variant text-body-md">
            Indicadores de rendimiento (KPIs) y analítica de tu facultad.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-white rounded-3xl p-6 border border-outline-variant shadow-sm relative overflow-hidden group hover:border-academic-gold transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-academic-gold/10 rounded-bl-[100px] transition-transform duration-500 group-hover:scale-110"></div>
          <span className="material-symbols-outlined text-3xl mb-3 text-academic-gold">local_activity</span>
          <p className="text-sm mt-1 text-on-surface-variant uppercase tracking-widest font-bold">Total Eventos</p>
          <p className="text-4xl font-black text-university-blue mt-2">{totalEvents.value}</p>
        </div>

        <div className="bg-surface-white rounded-3xl p-6 border border-outline-variant shadow-sm relative overflow-hidden group hover:border-innovation-purple transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-innovation-purple/10 rounded-bl-[100px] transition-transform duration-500 group-hover:scale-110"></div>
          <span className="material-symbols-outlined text-3xl mb-3 text-innovation-purple">location_city</span>
          <p className="text-sm mt-1 text-on-surface-variant uppercase tracking-widest font-bold">Espacios Activos</p>
          <p className="text-4xl font-black text-university-blue mt-2">{totalSpaces.value}</p>
        </div>

        <div className="bg-gradient-to-br from-university-blue to-innovation-purple rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group md:col-span-2">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="material-symbols-outlined text-3xl mb-3 opacity-80">groups</span>
                <p className="text-xs uppercase tracking-widest font-bold text-white/80">Impacto y Audiencia</p>
              </div>
              <div className="text-right flex gap-4 bg-black/20 rounded-xl p-3">
                 <div>
                   <p className="text-sm text-white/70">Estudiantes</p>
                   <p className="font-bold">{totalEstudiantes}</p>
                 </div>
                 <div className="w-px bg-white/20"></div>
                 <div>
                   <p className="text-sm text-white/70">Foráneos</p>
                   <p className="font-bold">{totalForaneos}</p>
                 </div>
              </div>
            </div>
            <div className="flex items-end justify-between mt-4">
              <div>
                <p className="text-5xl font-black">{totalAttendeesValue}</p>
                <p className="text-sm opacity-90 mt-1">Asistentes Históricos</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{totalRequestsValue}</p>
                <p className="text-xs opacity-90 mt-1">Solicitudes B2B</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-surface-container-lowest rounded-3xl border border-outline-variant p-8">
        <h3 className="font-headline-sm text-university-blue mb-4">Recomendaciones del Sistema</h3>
        <ul className="space-y-4">
          <li className="flex items-start gap-4">
            <span className="material-symbols-outlined text-academic-gold mt-0.5">lightbulb</span>
            <div>
              <p className="font-bold text-on-surface">Optimización de Aforos</p>
              <p className="text-sm text-on-surface-variant">Intenta asignar los eventos de pago a los espacios con mayor capacidad para maximizar el retorno (ROI).</p>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <span className="material-symbols-outlined text-innovation-purple mt-0.5">trending_up</span>
            <div>
              <p className="font-bold text-on-surface">Impulso de Patrocinios</p>
              <p className="text-sm text-on-surface-variant">Considera abrir solicitudes de patrocinio en eventos que históricamente superan los 100 asistentes.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
