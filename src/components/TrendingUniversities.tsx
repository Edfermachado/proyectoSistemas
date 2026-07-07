import React from 'react';

export function TrendingUniversities() {
  return (
    <section className="py-20 bg-university-blue text-surface-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-academic-gold via-transparent to-transparent"></div>
      </div>
      <div className="max-w-container-max mx-auto px-margin-desktop relative z-10">
        <h2 className="font-headline-lg text-headline-lg text-center mb-16">Trusted by Top <span className="text-academic-gold">Universities</span></h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-80">
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all cursor-pointer">
              <span className="material-symbols-outlined text-4xl text-academic-gold">account_balance</span>
            </div>
            <p className="font-label-md text-label-md">Imperial College</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all cursor-pointer">
              <span className="material-symbols-outlined text-4xl text-academic-gold">school</span>
            </div>
            <p className="font-label-md text-label-md">Stanford Institute</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all cursor-pointer">
              <span className="material-symbols-outlined text-4xl text-academic-gold">architecture</span>
            </div>
            <p className="font-label-md text-label-md">Tech University</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all cursor-pointer">
              <span className="material-symbols-outlined text-4xl text-academic-gold">auto_stories</span>
            </div>
            <p className="font-label-md text-label-md">Arts Academy</p>
          </div>
        </div>
      </div>
    </section>
  );
}
