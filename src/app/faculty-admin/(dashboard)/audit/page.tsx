import { db } from "@/db";
import { scanLogs, events, paymentAuditLogs } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AuditLogsPage() {
  const session = await getSession();
  const allowedRoles = ["tenant_admin", "superadmin", "event_manager"];
  if (!session || !allowedRoles.includes(session.role as string) || !session.tenantId) {
    redirect("/login");
  }

  // Get all events for this tenant/manager to filter the logs
  const tenantEvents = await db.query.events.findMany({
    where: session.role === "event_manager" 
      ? eq(events.managerId, session.userId as string)
      : eq(events.tenantId, session.tenantId as string),
    columns: { id: true, title: true }
  });

  const eventIds = tenantEvents.map(e => e.id);

  let qrLogs: any[] = [];
  let pmtLogs: any[] = [];
  if (eventIds.length > 0) {
    qrLogs = await db.query.scanLogs.findMany({
      where: inArray(scanLogs.eventId, eventIds),
      with: {
        event: true,
        attendee: true,
        scanner: true
      },
      orderBy: [desc(scanLogs.scannedAt)],
      limit: 100 // Limit to recent 100 logs for prototype
    });

    // We need to fetch paymentAuditLogs for attendees of these events
    // Since paymentAuditLogs doesn't directly have eventId, we do a raw query or join, 
    // but Drizzle relational query doesn't easily support deeply nested 'inArray' filtering from root.
    // Let's fetch all attendees for these events first, or just join.
    // For prototype, since it's a small app, we can fetch all paymentAuditLogs and filter by attendee's eventId.
    const allPaymentLogs = await db.query.paymentAuditLogs.findMany({
      with: {
        attendee: {
          with: { event: true }
        },
        performedBy: true
      },
      orderBy: [desc(paymentAuditLogs.createdAt)],
      limit: 300
    });
    
    pmtLogs = allPaymentLogs.filter(log => eventIds.includes(log.attendee.eventId)).slice(0, 100);
  }

  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Auditoría de Acceso</h1>
        <p className="text-on-surface-variant text-body-md">
          Registro visual de escaneos de códigos QR y control de acceso.
        </p>
      </div>

      <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
        {qrLogs.length === 0 ? (
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
                {qrLogs.map((log) => (
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

      <div className="pt-4">
        <h2 className="font-headline-md text-university-blue mb-2 text-2xl">Auditoría de Pagos</h2>
        <p className="text-on-surface-variant text-body-md mb-6">
          Registro inmutable de aprobaciones y rechazos de pagos para control financiero.
        </p>

        <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
          {pmtLogs.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-outline text-2xl">receipt_long</span>
              </div>
              <h3 className="font-title-md text-university-blue mb-2">Sin registros de pagos verificados</h3>
              <p className="text-on-surface-variant text-sm max-w-xs">
                Aún no se han verificado pagos en los eventos asignados.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-lowest border-b border-outline-variant">
                    <th className="px-6 py-4 text-sm font-bold text-university-blue uppercase tracking-wider">Fecha de Acción</th>
                    <th className="px-6 py-4 text-sm font-bold text-university-blue uppercase tracking-wide">Acción</th>
                    <th className="px-6 py-4 text-sm font-bold text-university-blue uppercase tracking-wide">Asistente</th>
                    <th className="px-6 py-4 text-sm font-bold text-university-blue uppercase tracking-wide">Evento</th>
                    <th className="px-6 py-4 text-sm font-bold text-university-blue uppercase tracking-wide">Gestor/Administrador</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50">
                  {pmtLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-academic-gold text-lg">admin_panel_settings</span>
                          <span className="text-sm font-mono text-on-surface-variant">
                            {log.createdAt ? new Date(log.createdAt).toLocaleString('es-ES', { 
                              day: '2-digit', month: '2-digit', year: 'numeric', 
                              hour: '2-digit', minute: '2-digit'
                            }) : 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          log.action === 'APROBADO' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-on-surface">
                        {log.attendee.name}
                        <div className="text-xs text-on-surface-variant">{log.attendee.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">
                        <Link href={`/faculty-admin/events/${log.attendee.event.id}/attendees`} className="hover:text-university-blue hover:underline">
                          {log.attendee.event.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-university-blue">{log.performedBy.name || log.performedBy.email}</span>
                          <span className="text-xs text-on-surface-variant mt-1">
                            {log.reason}
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
    </div>
  );
}
