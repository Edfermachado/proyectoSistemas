import Image from "next/image";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { events } from "@/db/schema";
import Link from "next/link";

export default async function FeaturedEvents() {
  const featuredEvents = await db.query.events.findMany({
    where: eq(events.isFeatured, true),
    with: {
      space: true,
      tenant: {
        with: {
          category: true
        }
      }
    },
    limit: 6,
    orderBy: (events, { desc }) => [desc(events.createdAt)],
  });

  return (
    <section className="py-20">
      <div className="max-w-container-max mx-auto px-margin-desktop">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-university-blue mb-4">
              Eventos Destacados
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-lg">
              Experiencias seleccionadas de todos los departamentos y facultades.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2 rounded-full border border-university-blue text-university-blue font-semibold hover:bg-university-blue hover:text-white transition-all">
              Hoy
            </button>
            <button className="px-6 py-2 rounded-full bg-university-blue text-white font-semibold shadow-md">
              Este Fin de Semana
            </button>
          </div>
        </div>

        {featuredEvents.length === 0 ? (
          <div className="text-center py-12 bg-surface-container-lowest rounded-3xl border border-outline-variant/30">
            <span className="material-symbols-outlined text-4xl text-outline mb-3">event_busy</span>
            <p className="text-on-surface-variant font-body-md">Por el momento no hay eventos destacados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((evt) => {
              const month = evt.date.toLocaleString('es', { month: 'short' }).toUpperCase();
              const day = evt.date.toLocaleString('es', { day: '2-digit' });
              const time = evt.date.toLocaleString('es', { hour: '2-digit', minute: '2-digit' });
              const isFree = Number(evt.price) === 0;

              return (
                <article
                  key={evt.id}
                  className="event-card-hover bg-surface-white rounded-2xl overflow-hidden shadow-sm border border-outline-variant group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      src={evt.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1470&auto=format&fit=crop"}
                      alt={evt.title}
                    />
                    <div className="absolute top-4 left-4 bg-surface-white rounded-xl p-2 text-center shadow-md border border-outline-variant min-w-[50px]">
                      <span className="block text-university-blue font-bold text-label-sm leading-tight uppercase">
                        {month}
                      </span>
                      <span className="block text-university-blue font-black text-headline-sm leading-none">
                        {day}
                      </span>
                    </div>
                    {evt.tenant?.category && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-innovation-purple text-white px-3 py-1 rounded-full text-label-sm font-bold shadow-lg">
                          {evt.tenant.category.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-title-lg text-title-lg text-university-blue mb-3 group-hover:text-innovation-purple transition-colors truncate">
                      {evt.title}
                    </h3>
                    <div className="space-y-2 mb-6">
                      <p className="flex items-center gap-2 text-on-surface-variant text-label-md">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        <span className="truncate">{evt.space?.name}</span>
                      </p>
                      <p className="flex items-center gap-2 text-on-surface-variant text-label-md">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        {time}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-extrabold text-headline-sm ${
                          isFree ? "text-green-600" : "text-university-blue"
                        }`}
                      >
                        {isFree ? "GRATIS" : `$${evt.price}`}
                      </span>
                      <Link href={`/events/${evt.slug || evt.id}`}>
                        <button className="bg-university-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-innovation-purple transition-colors flex items-center gap-2">
                          {isFree ? "Inscribirse" : "Comprar"}
                          <span className="material-symbols-outlined text-sm">
                            {isFree ? "app_registration" : "shopping_cart"}
                          </span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
