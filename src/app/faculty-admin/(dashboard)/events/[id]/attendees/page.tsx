import { db } from "@/db";
import { eq } from "drizzle-orm";
import { events as eventsSchema } from "@/db/schema";
import { AttendeesService } from "@/services/attendees.service";
import { notFound, redirect } from "next/navigation";
import { ConfirmPaymentButton } from "@/components/ui/ConfirmPaymentButton";
import { ManualRegisterForm } from "@/components/ui/ManualRegisterForm";
import Link from "next/link";

import { getSession } from "@/lib/auth";

export default async function EventAttendeesPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || !session.tenantId) redirect("/login");

  const { id } = await params;

  const event = await db.query.events.findFirst({
    where: eq(eventsSchema.id, id),
    with: { space: true, tenant: true }
  });

  if (!event || event.tenantId !== session.tenantId) notFound();

  const attendees = await AttendeesService.getAttendeesByEvent(id);
  const isFree = event.price?.toUpperCase() === 'FREE' || event.price?.toUpperCase() === 'GRATIS' || event.price === '0';
  
  const confirmed = attendees.filter(a => a.status === 'confirmado').length;
  const pending = attendees.filter(a => a.status === 'pago_pendiente').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Link href="/faculty-admin/events" className="inline-flex items-center gap-1 text-on-surface-variant text-sm hover:text-university-blue transition-colors w-fit">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver a Eventos
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline-lg text-university-blue">{event.title}</h1>
            <p className="text-on-surface-variant text-sm mt-1">
              {event.space?.name} · {new Date(event.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <ManualRegisterForm eventId={id} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-white rounded-2xl p-5 border border-outline-variant shadow-sm text-center">
          <p className="font-black text-3xl text-university-blue">{attendees.length}</p>
          <p className="text-on-surface-variant text-sm mt-1">Total registrados</p>
        </div>
        <div className="bg-surface-white rounded-2xl p-5 border border-outline-variant shadow-sm text-center">
          <p className="font-black text-3xl text-green-600">{confirmed}</p>
          <p className="text-on-surface-variant text-sm mt-1">Confirmados</p>
        </div>
        <div className="bg-surface-white rounded-2xl p-5 border border-outline-variant shadow-sm text-center">
          <p className="font-black text-3xl text-amber-500">{pending}</p>
          <p className="text-on-surface-variant text-sm mt-1">Pendientes de pago</p>
        </div>
        <div className="bg-surface-white rounded-2xl p-5 border border-outline-variant shadow-sm text-center">
          <p className="font-black text-3xl text-university-blue">{event.space?.capacity ?? "∞"}</p>
          <p className="text-on-surface-variant text-sm mt-1">Capacidad del espacio</p>
        </div>
      </div>

      {/* Attendees Table */}
      <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant/50 flex items-center justify-between">
          <h2 className="font-headline-sm text-university-blue">Lista de Asistentes</h2>
          <span className="text-sm text-on-surface-variant">Ordenados por fecha de registro</span>
        </div>

        {attendees.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-outline text-2xl">group_off</span>
            </div>
            <h3 className="font-title-md text-university-blue mb-2">Sin asistentes aún</h3>
            <p className="text-on-surface-variant text-sm max-w-xs">
              Nadie se ha registrado en este evento todavía. Puedes registrar asistentes manualmente usando el botón superior.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-lowest">
                  <th className="text-left px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wide">#</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wide">Nombre</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wide">Correo</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wide">Teléfono</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wide">Fecha Registro</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wide">Estado</th>
                  {!isFree && (
                    <>
                      <th className="text-left px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wide">Pago reportado</th>
                      <th className="text-left px-6 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wide">Acción</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {attendees.map((attendee, idx) => (
                  <tr key={attendee.id} className="border-b border-outline-variant/50 hover:bg-surface-container-lowest transition-colors">
                    <td className="px-6 py-4 text-sm text-on-surface-variant font-mono">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-university-blue/10 flex items-center justify-center text-university-blue font-bold text-sm shrink-0">
                          {attendee.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-university-blue text-sm">{attendee.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{attendee.email}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{attendee.phone}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      {new Date(attendee.createdAt!).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4">
                      {attendee.status === 'confirmado' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                          <span className="material-symbols-outlined text-xs">check_circle</span>
                          Confirmado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                          <span className="material-symbols-outlined text-xs">schedule</span>
                          Pendiente
                        </span>
                      )}
                    </td>
                    {!isFree && (
                      <>
                        <td className="px-6 py-4">
                          {attendee.paymentReference ? (
                            <div className="flex flex-col gap-1 text-sm">
                              <span className="font-mono bg-surface-container-low px-2 py-1 rounded text-university-blue">Ref: {attendee.paymentReference}</span>
                              {attendee.paymentScreenshotUrl && (
                                <a href={attendee.paymentScreenshotUrl} target="_blank" rel="noreferrer" className="text-academic-gold hover:underline flex items-center gap-1 text-xs">
                                  <span className="material-symbols-outlined text-xs">image</span> Ver Capture
                                </a>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-on-surface-variant italic">No reportado</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {attendee.status !== 'confirmado' && (
                            <ConfirmPaymentButton 
                              attendeeId={attendee.id} 
                              eventId={id} 
                              hasReport={!!attendee.paymentReference}
                            />
                          )}
                        </td>
                      </>
                    )}
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
