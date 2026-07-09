import { Button } from "@/components/ui/Button";
import { db } from "@/db";
import Link from "next/link";

export default async function AdminEventsPage() {
  const events = await db.query.events.findMany({
    with: { space: true, tenant: true },
    orderBy: (events, { desc }) => [desc(events.createdAt)],
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Auditoría de Eventos</h1>
          <p className="text-on-surface-variant text-body-md">Supervisión y control de todas las actividades programadas.</p>
        </div>
        <Link href="/admin/events/new">
          <Button variant="primary" icon="event">
            Programar Evento
          </Button>
        </Link>
      </div>

      <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
        {events.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-outline text-3xl">local_activity</span>
            </div>
            <h3 className="font-title-lg text-university-blue mb-2">No hay eventos</h3>
            <p className="text-on-surface-variant text-label-md max-w-sm">
              Aún no se han programado eventos en ninguna facultad.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant/50">
                  <th className="px-6 py-4 font-title-sm text-university-blue">Evento</th>
                  <th className="px-6 py-4 font-title-sm text-university-blue">Fecha</th>
                  <th className="px-6 py-4 font-title-sm text-university-blue">Facultad</th>
                  <th className="px-6 py-4 font-title-sm text-university-blue">Espacio</th>
                  <th className="px-6 py-4 font-title-sm text-university-blue">Precio</th>
                  <th className="px-6 py-4 text-right font-title-sm text-university-blue">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id} className="border-b border-outline-variant/50 hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-university-blue">{e.title}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{e.date.toLocaleString()}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{e.tenant?.name}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{e.space?.name}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{e.price}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-university-blue hover:text-innovation-purple p-2 transition-colors">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button className="text-error hover:text-error/80 p-2 ml-2 transition-colors">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
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
