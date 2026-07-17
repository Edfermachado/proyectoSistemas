import { db } from "@/db";
import { scanLogs, attendees, events, users, tenants } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AuditLogsPage() {
  const session = await getSession();
  if (!session || session.role !== "tenant_admin" || !session.tenantId) {
    redirect("/login");
  }

  // Get all events for this tenant to filter the logs
  const tenantEvents = await db.query.events.findMany({
    where: eq(events.tenantId, session.tenantId as string),
    columns: { id: true }
  });

  const eventIds = tenantEvents.map(e => e.id);

  let logs: any[] = [];
  if (eventIds.length > 0) {
    logs = await db.query.scanLogs.findMany({
      where: inArray(scanLogs.eventId, eventIds),
      with: {
        event: true,
        attendee: true,
        scanner: true
      },
      orderBy: [desc(scanLogs.scannedAt)],
      limit: 100 // Limit to recent 100 logs for prototype
    });
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Auditoría de Acceso</h1>
        <p className="text-on-surface-variant text-body-md">
          Registro visual de escaneos de códigos QR y control de acceso.
        </p>
      </div>

      <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-outline text-2xl">history_toggle_off</span>
            </div>
            <h3 className="font-title-md text-university-blue mb-2">Sin registros de auditoría</h3>
            <p className="text-on-surface-variant text-sm max-w-xs">
              Aún no se ha escaneado ningún código QR en los eventos de tu facultad.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant">
                  <th className="px-6 py-4 text-sm font-bold text-university-blue uppercase tracking-wider">Fecha y Hora</th>
                  <th className="px-6 py-4 text-sm font-bold text-university-blue uppercase tracking-wide">Asistente</th>
                  <th className="px-6 py-4 text-sm font-bold text-university-blue uppercase tracking-wide">Evento</th>
                  <th className="px-6 py-4 text-sm font-bold text-university-blue uppercase tracking-wide">Personal de Acceso (Escaneado por)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-innovation-purple text-lg">qr_code_scanner</span>
                        <span className="text-sm font-mono text-on-surface-variant">
                          {new Date(log.scannedAt).toLocaleString('es-ES', { 
                            day: '2-digit', month: '2-digit', year: 'numeric', 
                            hour: '2-digit', minute: '2-digit', second: '2-digit' 
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-on-surface">
                      {log.attendee.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      <Link href={`/faculty-admin/events/${log.event.id}/attendees`} className="hover:text-university-blue hover:underline">
                        {log.event.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-university-blue">{log.scanner.email}</span>
                        <span className="text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full w-fit mt-1">
                          {log.scanner.role === 'access_control' ? 'Control de Acceso' : 'Administrador'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
