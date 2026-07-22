import { db } from "@/db";
import Image from "next/image";

export default async function TrendingUniversities() {
  const unis = await db.query.universities.findMany({
    limit: 4,
    orderBy: (u, { desc }) => [desc(u.createdAt)],
  });

  if (unis.length === 0) return null;


  return (
    <section className="py-20 bg-university-blue text-surface-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-academic-gold via-transparent to-transparent"></div>
      </div>
      <div className="max-w-container-max mx-auto px-margin-desktop relative z-10">
        <h2 className="font-headline-lg text-headline-lg text-center mb-16">
          Con la confianza de las Mejores <span className="text-academic-gold">Universidades</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-80">
          {unis.map((u, i) => (
            <div key={i} className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all cursor-pointer overflow-hidden relative">
                {u.logoUrl ? (
                  <Image fill src={u.logoUrl} alt={u.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-4xl text-academic-gold">
                    account_balance
                  </span>
                )}
              </div>
              <p className="font-label-md text-label-md text-center">{u.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
