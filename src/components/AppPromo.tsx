import React from 'react';

export function AppPromo() {
  return (
    <section className="py-24 bg-surface-white">
      <div className="max-w-container-max mx-auto px-margin-desktop">
        <div className="bg-gradient-to-r from-university-blue to-innovation-purple rounded-[3rem] p-12 lg:p-20 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-academic-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="flex-1 space-y-8 relative z-10 text-center lg:text-left">
            <h2 className="font-display-lg text-display-lg text-white">Your Campus in <span className="text-academic-gold">Your Pocket</span>.</h2>
            <p className="text-white/80 font-body-lg text-body-lg max-w-lg">Get real-time notifications for faculty events, fast-pass entry with QR codes, and exclusive student-only discounts.</p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button className="bg-black text-white px-8 py-4 rounded-2xl flex items-center gap-4 hover:scale-105 transition-all shadow-xl">
                <span className="material-symbols-outlined text-3xl">smartphone</span>
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-white/60 leading-none">Download on the</p>
                  <p className="text-lg font-bold leading-none">App Store</p>
                </div>
              </button>
              <button className="bg-black text-white px-8 py-4 rounded-2xl flex items-center gap-4 hover:scale-105 transition-all shadow-xl">
                <span className="material-symbols-outlined text-3xl">play_books</span>
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-white/60 leading-none">Get it on</p>
                  <p className="text-lg font-bold leading-none">Google Play</p>
                </div>
              </button>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="relative w-72 h-[600px] bg-slate-900 rounded-[3rem] border-[12px] border-slate-800 shadow-2xl mx-auto overflow-hidden">
              <div className="absolute top-0 w-full h-8 bg-slate-800 flex justify-center items-end pb-1">
                <div className="w-20 h-4 bg-slate-900 rounded-full"></div>
              </div>
              <img className="w-full h-full object-cover pt-8" alt="App Promo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrdhlNNiTyxGBzRwAUdBsVdKKBSfXyl0IgJWag-RMu5LCsPR7HgYy-L1u-rch3ROqUHKY3fWx0XhxPVOafzIErAXU16hckQKRhrvWf9pdMtKc1ctS8YWYEDBxDNmleIuCjp28ww12NT1k_U-EH16HqjfSrmE6ABtBmELcP-MrwnLlBOhTqMIoxxMbKvAysRG-l1OlWCPjd-Wp-7VO0s_XJC5dzKFeEFNqjpxYZruid4fEi07jUOGPS3g5SA_UXnJ2igEA8vTbdBxwI" />
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-academic-gold rounded-full flex items-center justify-center text-university-blue animate-bounce">
              <span className="material-symbols-outlined text-6xl">qr_code_2</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
