import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { db } from "@/db";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { events as eventsSchema, tenants } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function FacultyEventsPage() {
  const session = await getSession();
  if (!session || !session.tenantId) redirect("/faculty-admin/login");

  const isAccessControl = session.role === 'access_control';

  const faculty = await db.query.tenants.findFirst({
    where: eq(tenants.id, session.tenantId as string),
  });
  
  const eventsList = faculty ? await db.query.events.findMany({
    where: eq(eventsSchema.tenantId, faculty.id),
    with: { space: true },
    orderBy: (events, { desc }) => [desc(events.createdAt)],
  }) : [];

  async function approveEvent(formData: FormData) {
    "use server";
    const eventId = formData.get("eventId") as string;
    await db.update(eventsSchema).set({ status: 'aprobado' }).where(eq(eventsSchema.id, eventId));
    revalidatePath("/faculty-admin/events");
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Mis Eventos</h1>
          <p className="text-on-surface-variant text-body-md">
            Gestiona los eventos exclusivos de <span className="font-bold text-academic-gold">{faculty?.name || "tu facultad"}</span>.
          </p>
        </div>
        {!isAccessControl && (
          <Link href="/faculty-admin/events/new">
            <Button variant="primary" icon="event">
              Crear Evento
            </Button>
          </Link>
        )}
      </div>

      <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
        {eventsList.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-outline text-3xl">local_activity</span>
            </div>
            <h3 className="font-title-lg text-university-blue mb-2">No tienes eventos</h3>
            <p className="text-on-surface-variant text-label-md max-w-sm">
              Crea tu primer evento para publicarlo en la cartelera de la universidad.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant/50">
                  <th className="px-6 py-4 font-title-sm text-university-blue">Evento</th>
                  <th className="px-6 py-4 font-title-sm text-university-blue">Fecha</th>
                  <th className="px-6 py-4 font-title-sm text-university-blue">Espacio</th>
                  <th className="px-6 py-4 font-title-sm text-university-blue">Precio</th>
                  <th className="px-6 py-4 font-title-sm text-university-blue">Estado</th>
                  <th className="px-6 py-4 font-title-sm text-university-blue">Asistentes</th>
                  <th className="px-6 py-4 text-right font-title-sm text-university-blue">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {eventsList.map((e) => (
                  <tr key={e.id} className="border-b border-outline-variant/50 hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-university-blue">{e.title}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{e.date.toLocaleString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{e.space?.name}</td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      <span className={`font-bold ${ (e.price?.toUpperCase() === 'FREE' || e.price?.toUpperCase() === 'GRATIS') ? 'text-green-600' : 'text-university-blue' }`}>
                        {e.price}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      <span className={`font-bold text-xs uppercase px-2 py-1 rounded-full ${
                        e.status === 'aprobado' ? 'bg-green-100 text-green-800' :
                        e.status === 'rechazado' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {e.status === 'aprobado' ? (
                        <Link href={`/faculty-admin/events/${e.id}/attendees`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-university-blue/10 text-university-blue rounded-lg text-xs font-bold hover:bg-university-blue hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-xs">group</span>
                          Ver Asistentes
                        </Link>
                      ) : (
                        <span className="text-xs text-on-surface-variant italic">Requiere aprobación</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      {!isAccessControl ? (
                        <>
                          {session.role === 'tenant_admin' && e.status === 'pendiente' && (
                            <form action={approveEvent}>
                              <input type="hidden" name="eventId" value={e.id} />
                              <button type="submit" className="text-green-600 hover:text-green-800 p-2 transition-colors tooltip" title="Aprobar Evento">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                              </button>
                            </form>
                          )}
                          <Link href={`/faculty-admin/events/${e.id}/edit`} className="text-university-blue hover:text-innovation-purple p-2 transition-colors">
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </Link>
                          <DeleteButton endpoint="events" id={e.id} />
                        </>
                      ) : (
                        <span className="text-xs text-on-surface-variant italic">Solo lectura</span>
                      )}
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
