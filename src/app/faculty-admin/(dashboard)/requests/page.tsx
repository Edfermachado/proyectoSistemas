import { db } from "@/db";
import { eventRequests } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RequestsDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "tenant_admin") {
    redirect("/login");
  }

  // Fetch all requests and include the event data
  const allRequests = await db.query.eventRequests.findMany({
    with: {
      event: true,
    },
    orderBy: [desc(eventRequests.createdAt)],
  });

  // Filter requests that belong to this admin's faculty
  const facultyRequests = allRequests.filter(
    (req) => req.event.tenantId === session.tenantId
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Solicitudes Externas</h1>
          <p className="text-on-surface-variant text-body-md">
            Gestiona patrocinios, acreditaciones de prensa y solicitudes de derechos para tus eventos.
          </p>
        </div>
      </div>

      <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low border-b border-outline-variant/50">
              <tr>
                <th className="px-6 py-4 font-bold text-sm text-on-surface-variant uppercase tracking-wider">ID / Fecha</th>
                <th className="px-6 py-4 font-bold text-sm text-on-surface-variant uppercase tracking-wider">Evento</th>
                <th className="px-6 py-4 font-bold text-sm text-on-surface-variant uppercase tracking-wider">Tipo de Solicitud</th>
                <th className="px-6 py-4 font-bold text-sm text-on-surface-variant uppercase tracking-wider">Metadata (Zod)</th>
                <th className="px-6 py-4 font-bold text-sm text-on-surface-variant uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {facultyRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant">
                    No hay solicitudes pendientes en este momento.
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
                      <p className="font-bold text-sm text-on-surface">{req.event.title}</p>
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
                    <td className="px-6 py-4">
                      <button className="text-innovation-purple hover:text-innovation-purple/80 font-bold text-sm bg-innovation-purple/10 px-4 py-2 rounded-lg transition-colors">
                        Revisar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
