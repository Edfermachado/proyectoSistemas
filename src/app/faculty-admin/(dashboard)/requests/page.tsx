import { db } from "@/db";
import { eventRequests } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { EventsService } from "@/services/events.service";
import { ApprovalButtons } from "./ApprovalButtons";

export default async function RequestsDashboardPage() {
  const session = await getSession();
  if (!session || (session.role !== "tenant_admin" && session.role !== "superadmin")) {
    redirect("/login");
  }

  const tenantId = typeof session.tenantId === 'string' ? session.tenantId : "";

  // 1. Fetch pending department events for approval by the Decano
  const pendingEvents = tenantId ? await EventsService.getPendingEventsByTenant(tenantId) : [];

  // 2. Fetch external requests (sponsorships, press, etc.)
  const allRequests = await db.query.eventRequests.findMany({
    with: {
      event: true,
    },
    orderBy: [desc(eventRequests.createdAt)],
  });

  const facultyRequests = allRequests.filter(
    (req) => req.event?.tenantId === tenantId
  );

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-headline-lg text-university-blue mb-2 text-3xl font-bold">
          Aprobaciones y Solicitudes Institucionales
        </h1>
        <p className="text-on-surface-variant text-body-md">
          Supervisión del Decanato: Aprobar propuestas de eventos creadas por los Departamentos y gestionar solicitudes externas.
        </p>
      </div>

      {/* SECTION 1: Pending Department Events Approval */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-university-blue flex items-center gap-2">
            <span>🏛️</span> Propuestas de Eventos por Departamentos
            {pendingEvents.length > 0 && (
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {pendingEvents.length} Pendiente{pendingEvents.length > 1 ? "s" : ""}
              </span>
            )}
          </h2>
        </div>

        <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low border-b border-outline-variant/50">
                <tr>
                  <th className="px-6 py-4 font-bold text-xs text-on-surface-variant uppercase tracking-wider">Evento / Fecha</th>
                  <th className="px-6 py-4 font-bold text-xs text-on-surface-variant uppercase tracking-wider">Departamento Proponente</th>
                  <th className="px-6 py-4 font-bold text-xs text-on-surface-variant uppercase tracking-wider">Espacio Físico / Aforo</th>
                  <th className="px-6 py-4 font-bold text-xs text-on-surface-variant uppercase tracking-wider">Precio</th>
                  <th className="px-6 py-4 font-bold text-xs text-on-surface-variant uppercase tracking-wider text-right">Decisión del Decanato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {pendingEvents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-on-surface-variant">
                      <p className="font-medium text-sm">No hay propuestas de eventos pendientes de aprobación.</p>
                      <p className="text-xs text-on-surface-variant/70 mt-1">Los departamentos de la facultad no tienen solicitudes activas en cola.</p>
                    </td>
                  </tr>
                ) : (
                  pendingEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-sm text-on-surface">{evt.title}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          📅 {new Date(evt.date).toLocaleDateString("es-VE", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-university-blue/10 text-university-blue">
                          🏢 {evt.department?.name || "Departamento Académico"}
                        </span>
                        {evt.manager && (
                          <p className="text-xs text-on-surface-variant mt-1">
                            👤 Gestor: {evt.manager.name || evt.manager.email}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-on-surface">{evt.space?.name}</p>
                        <p className="text-xs text-on-surface-variant">Capacidad: {evt.capacity || evt.space?.capacity} personas</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${Number(evt.price) > 0 ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"}`}>
                          {Number(evt.price) > 0 ? `$${evt.price}` : "Gratuito"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ApprovalButtons eventId={evt.id} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 2: External Requests */}
      <div className="space-y-4 pt-6">
        <h2 className="text-xl font-bold text-university-blue flex items-center gap-2">
          <span>📋</span> Solicitudes Externas y Patrocinios
        </h2>

        <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low border-b border-outline-variant/50">
                <tr>
                  <th className="px-6 py-4 font-bold text-xs text-on-surface-variant uppercase tracking-wider">ID / Fecha</th>
                  <th className="px-6 py-4 font-bold text-xs text-on-surface-variant uppercase tracking-wider">Evento</th>
                  <th className="px-6 py-4 font-bold text-xs text-on-surface-variant uppercase tracking-wider">Tipo de Solicitud</th>
                  <th className="px-6 py-4 font-bold text-xs text-on-surface-variant uppercase tracking-wider">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {facultyRequests.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-on-surface-variant text-sm">
                      No hay solicitudes externas registradas.
                    </td>
                  </tr>
                ) : (
                  facultyRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-sm text-university-blue">{req.id.split("-")[0]}</p>
                        <p className="text-xs text-on-surface-variant mt-1">
                          {new Date(req.createdAt || "").toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-sm text-on-surface">{req.event?.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-academic-gold/20 text-academic-gold capitalize">
                          {req.requestType.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <pre className="text-xs bg-surface-container p-2 rounded-lg text-on-surface-variant overflow-x-auto max-w-xs">
                          {JSON.stringify(req.metadata, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
