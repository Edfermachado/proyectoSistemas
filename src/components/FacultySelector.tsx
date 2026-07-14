import Link from "next/link";

export default function FacultySelector() {
  const faculties = [
    { icon: "engineering", name: "Ingeniería", slug: "facultad-de-ingenieria" },
    { icon: "science", name: "Ciencias de la Computación", slug: "facultad-de-ciencias-de-la-computacion" },
    { icon: "palette", name: "Bellas Artes", slug: "facultad-de-bellas-artes" },
    { icon: "medical_services", name: "Medicina", slug: "" },
    { icon: "history_edu", name: "Humanidades", slug: "" },
    { icon: "sports_basketball", name: "Deportes", slug: "" },
    { icon: "account_balance", name: "Negocios", slug: "" },
    { icon: "language", name: "Idiomas", slug: "" },
  ];

  return (
    <section className="py-12 bg-surface-container-low border-b border-outline-variant">
      <div className="max-w-container-max mx-auto px-margin-desktop">
        <h2 className="font-headline-md text-headline-md text-university-blue mb-8">
          Explorar por Facultad
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
          {faculties.map((faculty, i) => (
            <Link
              href={faculty.slug ? `/events?faculty=${faculty.slug}` : `/events`}
              key={i}
              className="flex flex-col items-center gap-3 min-w-[120px] p-6 bg-surface-white rounded-2xl shadow-sm border border-outline-variant hover:border-university-blue hover:text-university-blue transition-all group"
            >
              <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-university-blue/10">
                <span className="material-symbols-outlined text-university-blue">
                  {faculty.icon}
                </span>
              </div>
              <span className="font-label-md text-label-md font-semibold text-center leading-tight">
                {faculty.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
