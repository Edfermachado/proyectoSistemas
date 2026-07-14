import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { db } from "@/db";
import { eq, ilike, and, or } from "drizzle-orm";
import { events as eventsSchema, tenants, spaces, universities } from "@/db/schema";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { findTenantBySlugOrId, findCategoryBySlugOrId } from "@/lib/slug-helpers";
import { categories as categoriesSchema } from "@/db/schema";

export const metadata: Metadata = {
  title: "Explorar Eventos — UniEvents",
  description: "Descubre conferencias, deportes, talleres y más eventos universitarios.",
};

export default async function EventsExplorePage({ searchParams }: { searchParams: Promise<{ faculty?: string, category?: string, q?: string }> }) {
  const { faculty: facultyId, category: categorySlug, q: query } = await searchParams;

  // Resolve faculty from slug or ID
  let resolvedFacultyId: string | undefined;
  let facultyName = "Todas las Facultades";
  if (facultyId) {
    const tenant = await findTenantBySlugOrId(facultyId);
    if (tenant) {
      resolvedFacultyId = tenant.id;
      facultyName = tenant.name;
    }
  }

  // Resolve category
  let resolvedCategoryId: string | undefined;
  let categoryName = "";
  if (categorySlug) {
    const category = await findCategoryBySlugOrId(categorySlug);
    if (category) {
      resolvedCategoryId = category.id;
      categoryName = category.name;
    }
  }

  let whereClause = undefined;
  if (resolvedFacultyId && query) {
    whereClause = and(
      eq(eventsSchema.tenantId, resolvedFacultyId),
      or(
        ilike(eventsSchema.title, `%${query}%`),
        ilike(eventsSchema.description, `%${query}%`)
      )
    );
  } else if (resolvedFacultyId) {
    whereClause = eq(eventsSchema.tenantId, resolvedFacultyId);
  } else if (resolvedCategoryId && query) {
    whereClause = and(
      eq(tenants.categoryId, resolvedCategoryId),
      or(
        ilike(eventsSchema.title, `%${query}%`),
        ilike(eventsSchema.description, `%${query}%`)
      )
    );
  } else if (resolvedCategoryId) {
    whereClause = eq(tenants.categoryId, resolvedCategoryId);
  } else if (query) {
    whereClause = or(
      ilike(eventsSchema.title, `%${query}%`),
      ilike(eventsSchema.description, `%${query}%`),
      ilike(tenants.name, `%${query}%`),
      ilike(universities.name, `%${query}%`)
    );
  }

  const rows = await db
    .select({
      event: eventsSchema,
      tenant: tenants,
      space: spaces,
    })
    .from(eventsSchema)
    .leftJoin(tenants, eq(eventsSchema.tenantId, tenants.id))
    .leftJoin(spaces, eq(eventsSchema.spaceId, spaces.id))
    .leftJoin(universities, eq(tenants.universityId, universities.id))
    .where(whereClause)
    .orderBy(eventsSchema.date);

  const events = rows.map((row) => ({
    ...row.event,
    tenant: row.tenant,
    space: row.space,
  }));

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
            {facultyId 
              ? `Mostrando eventos programados en ${facultyName}.` 
              : categorySlug 
                ? `Explorando eventos en la categoría de ${categoryName}.`
                : "Descubre conferencias, deportes, talleres y más en tu universidad."}
          </p>
          
          <form className="mt-8 max-w-2xl animate-fade-in flex flex-col sm:flex-row gap-2" style={{ animationDelay: "200ms" }}>
            {facultyId && <input type="hidden" name="faculty" value={facultyId} />}
            {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
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
              No hay eventos programados que coincidan con tu búsqueda actual {facultyId ? `en ${facultyName}` : categorySlug ? `en la categoría ${categoryName}` : ""}.
            </p>
            {(facultyId || categorySlug || query) && (
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
                      <Link href={`/events/${evt.slug || evt.id}`}>
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
