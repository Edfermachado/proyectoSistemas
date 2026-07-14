import Link from "next/link";
import { db } from "@/db";

export default async function FacultySelector() {
  const categories = await db.query.categories.findMany({
    orderBy: (c, { desc }) => [desc(c.createdAt)],
  });

  if (categories.length === 0) return null; // Or return a default list if needed

  return (
    <section className="py-12 bg-surface-container-low border-b border-outline-variant">
      <div className="max-w-container-max mx-auto px-margin-desktop">
        <h2 className="font-headline-md text-headline-md text-university-blue mb-8">
          Explorar por Categoría
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
          {categories.map((category) => (
            <Link
              href={category.slug ? `/events?category=${category.slug}` : `/events`}
              key={category.id}
              className="flex flex-col items-center gap-3 min-w-[120px] p-6 bg-surface-white rounded-2xl shadow-sm border border-outline-variant hover:border-university-blue hover:text-university-blue transition-all group"
            >
              <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-university-blue/10">
                <span className="material-symbols-outlined text-university-blue">
                  {category.icon || "category"}
                </span>
              </div>
              <span className="font-label-md text-label-md font-semibold text-center leading-tight">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
