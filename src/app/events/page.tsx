import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { db } from "@/db";
import { eq, ilike, and } from "drizzle-orm";
import { events as eventsSchema, tenants } from "@/db/schema";
import Link from "next/link";
import Image from "next/image";

export default async function EventsExplorePage({ searchParams }: { searchParams: Promise<{ faculty?: string, q?: string }> }) {
  const { faculty: facultyId, q: query } = await searchParams;

  let whereClause = undefined;
  
  if (facultyId && query) {
    whereClause = and(eq(eventsSchema.tenantId, facultyId), ilike(eventsSchema.title, `%${query}%`));
  } else if (facultyId) {
    whereClause = eq(eventsSchema.tenantId, facultyId);
  } else if (query) {
    whereClause = ilike(eventsSchema.title, `%${query}%`);
  }

  const events = await db.query.events.findMany({
    where: whereClause,
    with: { space: true, tenant: true },
    orderBy: (events, { asc }) => [asc(events.date)], // Mostrar los próximos eventos primero
  });

  let facultyName = "Todas las Facultades";
  if (facultyId) {
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.id, facultyId)
    });
    if (tenant) {
      facultyName = tenant.name;
    }
  }

  return (
    <main className="bg-surface">
      <Header />
      
      <section className="relative pt-32 pb-16 bg-university-blue overflow-hidden min-h-[40vh] flex items-center">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-academic-gold via-transparent to-transparent"></div>
        </div>
        <div className="max-w-container-max mx-auto px-margin-desktop relative z-10 w-full">
          <h1 className="font-display-lg text-display-lg text-surface-white mb-4 animate-fade-in">
            Explorar <span className="text-academic-gold">Eventos</span>
          </h1>
          <p className="text-white/80 font-body-lg max-w-2xl animate-fade-in" style={{ animationDelay: "100ms" }}>
            {facultyId ? `Mostrando eventos programados en ${facultyName}.` : "Descubre conferencias, deportes, talleres y más en tu universidad."}
          </p>
          
          <form className="mt-8 max-w-2xl animate-fade-in flex gap-2" style={{ animationDelay: "200ms" }}>
            {facultyId && <input type="hidden" name="faculty" value={facultyId} />}
            <div className="flex-1 flex items-center bg-white/10 rounded-xl px-4 py-3 border border-white/20 focus-within:border-academic-gold transition-colors">
              <span className="material-symbols-outlined text-white/50 mr-3">search</span>
              <input 
                type="text" 
                name="q"
                defaultValue={query || ""}
                placeholder="Buscar por título de evento..."
                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-white/50 focus:outline-none"
              />
            </div>
            <button type="submit" className="bg-academic-gold text-university-blue px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
              Buscar
            </button>
          </form>
        </div>
      </section>

      <section className="py-20 max-w-container-max mx-auto px-margin-desktop">
        {events.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center bg-surface-white rounded-3xl border border-outline-variant shadow-sm">
            <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-outline text-4xl">event_busy</span>
            </div>
            <h3 className="font-title-lg text-university-blue mb-2">No se encontraron eventos</h3>
            <p className="text-on-surface-variant max-w-md mb-6">
              No hay eventos programados que coincidan con tu búsqueda actual en {facultyName}.
            </p>
            {(facultyId || query) && (
              <Link href="/events" className="text-academic-gold font-bold hover:underline">
                Ver todos los eventos
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((evt, idx) => {
              const eDate = new Date(evt.date);
              const isFree = evt.price?.toUpperCase() === 'FREE' || evt.price?.toUpperCase() === 'GRATIS' || evt.price === '0';
              
              const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
              const monthStr = months[eDate.getMonth()];
              const dayStr = eDate.getDate().toString().padStart(2, '0');
              const timeStr = `${eDate.getHours().toString().padStart(2, '0')}:${eDate.getMinutes().toString().padStart(2, '0')}`;

              return (
                <article
                  key={evt.id}
                  className="bg-surface-white rounded-2xl overflow-hidden shadow-sm border border-outline-variant group hover:shadow-lg transition-all flex flex-col animate-fade-in"
                  style={{ animationDelay: `${(idx % 10) * 50}ms` }}
                >
                  <div className="relative h-56 overflow-hidden bg-surface-container-high">
                    {evt.imageUrl ? (
                      <Image
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        src={evt.imageUrl}
                        alt={evt.title}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-university-blue/5">
                        <span className="material-symbols-outlined text-6xl text-university-blue/20">local_activity</span>
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4 bg-surface-white rounded-xl p-2 text-center shadow-md border border-outline-variant min-w-[50px] z-10">
                      <span className="block text-university-blue font-bold text-label-sm leading-tight uppercase">
                        {monthStr}
                      </span>
                      <span className="block text-university-blue font-black text-headline-sm leading-none">
                        {dayStr}
                      </span>
                    </div>
                    
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-innovation-purple text-white px-3 py-1 rounded-full text-label-sm font-bold shadow-lg truncate max-w-[150px] block">
                        {evt.tenant?.name || "Global"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-title-lg text-title-lg text-university-blue mb-3 group-hover:text-innovation-purple transition-colors line-clamp-2">
                      {evt.title}
                    </h3>
                    
                    <div className="space-y-2 mb-6 flex-1">
                      <p className="flex items-center gap-2 text-on-surface-variant text-label-md">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        <span className="truncate">{evt.space?.name || "Por definir"}</span>
                      </p>
                      <p className="flex items-center gap-2 text-on-surface-variant text-label-md">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        {timeStr} ({evt.duration} min)
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/50">
                      <span
                        className={`font-extrabold text-title-lg ${
                          isFree ? "text-green-600" : "text-university-blue"
                        }`}
                      >
                        {isFree ? "GRATIS" : evt.price}
                      </span>
                      <Link href={`/events/${evt.id}`}>
                        <button className="bg-university-blue text-white px-5 py-2 rounded-lg font-bold hover:bg-innovation-purple transition-colors flex items-center gap-2">
                          Detalles
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
