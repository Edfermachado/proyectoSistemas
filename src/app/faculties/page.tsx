import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { db } from "@/db";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function FacultiesPage() {
  const allFaculties = await db.query.tenants.findMany({
    with: { university: true },
    orderBy: (tenants, { desc }) => [desc(tenants.createdAt)],
  });

  return (
    <main>
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-university-blue overflow-hidden min-h-[50vh] flex items-center">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-academic-gold via-transparent to-transparent"></div>
        </div>
        <div className="max-w-container-max mx-auto px-margin-desktop relative z-10 text-center space-y-6">
          <h1 className="font-display-lg text-display-lg text-surface-white animate-fade-in">
            Explora Nuestras <span className="text-academic-gold">Facultades</span>
          </h1>
          <p className="text-white/80 font-body-lg max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "100ms" }}>
            Descubre las organizaciones, departamentos y escuelas que ofrecen los mejores eventos en la comunidad universitaria.
          </p>
        </div>
      </section>

      {/* Faculties Grid */}
      <section className="py-24 bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allFaculties.map((faculty, index) => (
              <div
                key={faculty.id}
                className="group bg-surface-white rounded-3xl p-8 border border-outline-variant shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-innovation-purple/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="w-16 h-16 bg-academic-gold/10 text-academic-gold rounded-2xl flex items-center justify-center mb-6 group-hover:bg-academic-gold group-hover:text-surface-white transition-colors duration-300">
                  <span className="material-symbols-outlined text-3xl">school</span>
                </div>
                
                <h3 className="font-title-lg text-university-blue mb-1 group-hover:text-innovation-purple transition-colors">
                  {faculty.name}
                </h3>
                
                {faculty.university && (
                  <p className="text-academic-gold font-label-sm uppercase tracking-widest mb-3">
                    {faculty.university.name}
                  </p>
                )}
                
                <p className="text-on-surface-variant font-body-md line-clamp-3 mb-8 min-h-[4.5rem]">
                  {faculty.description || "Descubre los espacios, horarios y próximos eventos ofrecidos por esta facultad."}
                </p>
                
                <Link href={`/events?faculty=${faculty.slug || faculty.id}`} className="inline-flex items-center gap-2 text-university-blue font-bold group-hover:text-innovation-purple transition-colors">
                  Ver Eventos
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-2 transition-transform">arrow_forward</span>
                </Link>
              </div>
            ))}
            
            {allFaculties.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-outline text-4xl">domain_disabled</span>
                </div>
                <h3 className="font-title-lg text-university-blue mb-2">No Se Encontraron Facultades</h3>
                <p className="text-on-surface-variant">Actualmente no hay facultades registradas en el sistema.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
