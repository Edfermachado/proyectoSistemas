import React from 'react';

export function Hero() {
  return (
    <section className="relative pt-24 pb-12 overflow-hidden bg-university-blue min-h-[85vh] flex items-center">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none"></div>
      <div className="max-w-container-max mx-auto px-margin-desktop grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-academic-gold/20 text-academic-gold px-4 py-1 rounded-full border border-academic-gold/30">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest">Trending in Campus</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-surface-white">Experience Your <span className="text-academic-gold">University Journey</span> To The Fullest.</h1>
          <p className="font-body-lg text-body-lg text-on-primary-container/80 max-w-xl">From high-stakes championships to late-night faculty galas, find every ticket to the moments that define your student life.</p>
          <div className="bg-surface-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-2xl border border-outline-variant">
            <div className="flex-1 flex items-center px-4 border-r border-outline-variant/50">
              <span className="material-symbols-outlined text-university-blue mr-3">school</span>
              <input className="w-full border-none focus:ring-0 text-body-md py-3" placeholder="Search by Faculty or University" type="text" />
            </div>
            <button className="bg-university-blue text-surface-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-innovation-purple transition-all duration-300">
              <span className="material-symbols-outlined">search</span>
              Find Events
            </button>
          </div>
          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-4">
              <div className="w-10 h-10 rounded-full border-2 border-university-blue bg-slate-500 overflow-hidden">
                <img className="w-full h-full object-cover" alt="Student 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDono8M6zN8lr0aqzEqWJmvmLIvXohTtVrXorEqeMpn6gjn5UqI0mGTj7i7jW2i64_xUjdt9OItKjbfjPGONLC5xBLAgrHluUFZoPwtHz9oHIz-T5LTBmD5dyKexdMHe0l1pq0pVedyw6qFhLNEMUzLlFT0ySjSry7IVh7C9HCAHrJl0xM8T1p0QREDSXb_QlKbTzxwuWucuqeG4EYGjfcnenfKxvaJD7reDwLsNgCDvGXMdgrXIC7ymre6orjpPDvYyerQxao_90WY" />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-university-blue bg-slate-500 overflow-hidden">
                <img className="w-full h-full object-cover" alt="Student 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoclTX8cfYm9iuXp-7J2QroeNVSQJidV13UfabBG2nXBL8c7VbXp12IN3A3M2jrGpWtn7p_ju4KpiyfDAyedDZISwOYsv7BV76RFvDNnp7NgsfvabgqvtBke6LdpApmp9VHhnvweVCrFVUTmDgJArmgl5Yl3EFIfeV3d9tRXR-BXxNRvtQqAmfRIEo0KimjDFd5-XdAfcrNhN2HQKym6rY8ITPYTOqwFCBwPCFTohPhtPY51soLVyMbayemgz1luWlyIBJgxV3KwR6" />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-university-blue bg-slate-500 overflow-hidden">
                <img className="w-full h-full object-cover" alt="Student 3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2J7L-Twl-3etlhKNtRhe1CBmKwtgueDeLlW3GqmydirWYxDkJ3HkzC5rOBfjEdcYIdSvaDIW7_G9xir9FK0XnKsO3HoJeLpMzQat7-xeJ2OnLc0RKjwdYgnTLR9oJoWvIVAdPuM_mCdL8Rl4SpIr9iQHHZZLcIGGQso8RLI4jtDT0gMtrUPwaidl_C6wB-d379_r7TxXWusQ872y8WEz6jxZxqq9K4aGGEmgOkFLLbGSsHIrNS7SN4Ma0rBT91kvvtGpy9inWeIHZ" />
              </div>
            </div>
            <p className="text-on-primary-container/60 text-label-md font-medium">+15k students booked this week</p>
          </div>
        </div>
        <div className="hidden lg:block relative group">
          <div className="absolute -inset-4 bg-academic-gold rounded-[2rem] rotate-3 opacity-20 group-hover:rotate-6 transition-transform"></div>
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/5] border-4 border-surface-white/10">
            <img className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" alt="Expo" src="https://lh3.googleusercontent.com/aida/AP1WRLtJRQD-GHfhea71C9S8RSBDXBh7MBu4e_xwfqbeCofCTGmxgZ0IjmwOaDOvyfur3pUaYdEws5vK1F7XhLJxFuUX4H8rpMkDW0q0BwhXKZND0SR4k-pLzgYCd2uJnswNqst4aACruAtvVRD6owGaIP7LTYFbVAhBdC9O0Xxlhf6W3Yx71ZS3kbMSDS-_TRl_Msp6t8beWgrCnlcJmmHkfC4ZOBhsRLVbOP6ZjoHdvSQY7OYd2ztcbQn5e_GL" />
            <div className="absolute bottom-0 left-0 right-0 p-8 gradient-overlay flex flex-col justify-end">
              <div className="bg-innovation-purple text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit mb-3">Live Now</div>
              <h3 className="text-white font-headline-md text-headline-md mb-2">Annual Engineering Expo 2024</h3>
              <p className="text-white/80 text-body-md flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">location_on</span> Main Tech Plaza
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
