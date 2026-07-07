import React from 'react';

const faculties = [
  { name: 'Engineering', icon: 'engineering' },
  { name: 'Medicine', icon: 'medical_services' },
  { name: 'Arts', icon: 'palette' },
  { name: 'Humanities', icon: 'history_edu' },
  { name: 'Sports', icon: 'sports_basketball' },
  { name: 'Science', icon: 'science' },
  { name: 'Business', icon: 'account_balance' },
  { name: 'Languages', icon: 'language' },
];

export function FacultySelector() {
  return (
    <section className="py-12 bg-surface-container-low border-b border-outline-variant">
      <div className="max-w-container-max mx-auto px-margin-desktop">
        <h2 className="font-headline-md text-headline-md text-university-blue mb-8">Browse by Faculty</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
          {faculties.map((faculty) => (
            <button key={faculty.name} className="flex flex-col items-center gap-3 min-w-[120px] p-6 bg-surface-white rounded-2xl shadow-sm border border-outline-variant hover:border-university-blue hover:text-university-blue transition-all group">
              <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-university-blue/10">
                <span className="material-symbols-outlined text-university-blue">{faculty.icon}</span>
              </div>
              <span className="font-label-md text-label-md font-semibold">{faculty.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
