export default function FacultySelector() {
  const faculties = [
    { icon: "engineering", name: "Engineering" },
    { icon: "medical_services", name: "Medicine" },
    { icon: "palette", name: "Arts" },
    { icon: "history_edu", name: "Humanities" },
    { icon: "sports_basketball", name: "Sports" },
    { icon: "science", name: "Science" },
    { icon: "account_balance", name: "Business" },
    { icon: "language", name: "Languages" },
  ];

  return (
    <section className="py-12 bg-surface-container-low border-b border-outline-variant">
      <div className="max-w-container-max mx-auto px-margin-desktop">
        <h2 className="font-headline-md text-headline-md text-university-blue mb-8">
          Browse by Faculty
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
          {faculties.map((faculty, i) => (
            <button
              key={i}
              className="flex flex-col items-center gap-3 min-w-[120px] p-6 bg-surface-white rounded-2xl shadow-sm border border-outline-variant hover:border-university-blue hover:text-university-blue transition-all group"
            >
              <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-university-blue/10">
                <span className="material-symbols-outlined text-university-blue">
                  {faculty.icon}
                </span>
              </div>
              <span className="font-label-md text-label-md font-semibold">
                {faculty.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
