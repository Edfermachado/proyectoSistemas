import React from 'react';

export function FeaturedEvents() {
  return (
    <main className="py-20">
      <div className="max-w-container-max mx-auto px-margin-desktop">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-university-blue mb-4">Featured Campus Events</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-lg">Hand-picked experiences across all departments and universities.</p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2 rounded-full border border-university-blue text-university-blue font-semibold hover:bg-university-blue hover:text-white transition-all">Today</button>
            <button className="px-6 py-2 rounded-full bg-university-blue text-white font-semibold shadow-md">This Weekend</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article className="event-card-hover bg-surface-white rounded-2xl overflow-hidden shadow-sm border border-outline-variant">
            <div className="relative h-64 overflow-hidden">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AP1WRLsM4r_jaW7lQPgpgG3ivsQUumbeHJdVF1rfkMmbpwGBkbW2InqnleBtNIAdELpnzDtAZkXTow9qN8N8ixjJ2D8zPPBOTVsV_4nyDacVwfRWgQLu-8QUe4g4w54khcpJ3ZfzIkXnXHCxzss-mW1vpJKvJRfJGJ59fQpWvndizAbAVmah3D3ynBaXHXThcP7AsRH9YVJFG_JRg4DwnZUt-39JHkeeG9mkol-q55Z7kCnpFaCYdi96OqRYxomY" alt="Basketball Cup" />
              <div className="absolute top-4 left-4 bg-surface-white rounded-xl p-2 text-center shadow-md border border-outline-variant min-w-[50px]">
                <span className="block text-university-blue font-bold text-label-sm leading-tight uppercase">Jun</span>
                <span className="block text-university-blue font-black text-headline-sm leading-none">28</span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="bg-innovation-purple text-white px-3 py-1 rounded-full text-label-sm font-bold shadow-lg">Inter-Uni Sports</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-title-lg text-title-lg text-university-blue mb-3 group-hover:text-innovation-purple transition-colors">University Basketball Cup Finals</h3>
              <div className="space-y-2 mb-6">
                <p className="flex items-center gap-2 text-on-surface-variant text-label-md">
                  <span className="material-symbols-outlined text-sm">location_on</span> Multi-Sport Indoor Arena
                </p>
                <p className="flex items-center gap-2 text-on-surface-variant text-label-md">
                  <span className="material-symbols-outlined text-sm">schedule</span> 18:00 PM - 21:00 PM
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-university-blue font-extrabold text-headline-sm">$12.50</span>
                <button className="bg-university-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-innovation-purple transition-colors flex items-center gap-2">
                  Buy Ticket
                  <span className="material-symbols-outlined text-sm">shopping_cart</span>
                </button>
              </div>
            </div>
          </article>
          <article className="event-card-hover bg-surface-white rounded-2xl overflow-hidden shadow-sm border border-outline-variant">
            <div className="relative h-64 overflow-hidden">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AP1WRLtW3caMfd_05I9KWZExov2ccAndk0pgNPtzdG4xKQzKWBOd5uwraesd4W4ZUHDaamTc-GqWby-CF0i9m6CJv0saCciPPQAfuYWENnncKw77VlZq3jGWZ6_sQ614zvkfVRp0L9wB1I1tXtnHI46rMO51Q9I4Er_G3TskQmLximILNyCVoYOWt1n4MI2hf2ySK184M-etauvBb_0AzniNkrxe_qDKaF-rlRz3tlv-ViYyATQikSUu8us0YPA" alt="Festival" />
              <div className="absolute top-4 left-4 bg-surface-white rounded-xl p-2 text-center shadow-md border border-outline-variant min-w-[50px]">
                <span className="block text-university-blue font-bold text-label-sm leading-tight uppercase">Jul</span>
                <span className="block text-university-blue font-black text-headline-sm leading-none">05</span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="bg-innovation-purple text-white px-3 py-1 rounded-full text-label-sm font-bold shadow-lg">Campus Festivals</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-title-lg text-title-lg text-university-blue mb-3">Summer Vibes: Faculty of Arts Gala</h3>
              <div className="space-y-2 mb-6">
                <p className="flex items-center gap-2 text-on-surface-variant text-label-md">
                  <span className="material-symbols-outlined text-sm">location_on</span> West Wing Gardens
                </p>
                <p className="flex items-center gap-2 text-on-surface-variant text-label-md">
                  <span className="material-symbols-outlined text-sm">schedule</span> 20:00 PM - Late
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-university-blue font-extrabold text-headline-sm">$25.00</span>
                <button className="bg-university-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-innovation-purple transition-colors flex items-center gap-2">
                  Buy Ticket
                  <span className="material-symbols-outlined text-sm">shopping_cart</span>
                </button>
              </div>
            </div>
          </article>
          <article className="event-card-hover bg-surface-white rounded-2xl overflow-hidden shadow-sm border border-outline-variant">
            <div className="relative h-64 overflow-hidden">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AP1WRLu4Ey3tEeslXcOOKIHghqJZ80LR43D2Wkov97HeANnlu3IRDXD5SRs3bqrPtb0RzqBV7LkPGjji0AazjglvOVEpm58Y1puAFOqxkzKw82_gkzx3gA0H4Rc3i2oUVe592yPokan0ykLDmWCztJQ_HdnzVwnsLia15-hpEzBuTZ_xXuw9rH5deFmkPgECU8EdeJ0bi-K4RnklZXR6KXg5vjvbdBy7IyGzlKw-qXcRgOjOsdmnSfyDt-y-hGQJ" alt="Conference" />
              <div className="absolute top-4 left-4 bg-surface-white rounded-xl p-2 text-center shadow-md border border-outline-variant min-w-[50px]">
                <span className="block text-university-blue font-bold text-label-sm leading-tight uppercase">Jul</span>
                <span className="block text-university-blue font-black text-headline-sm leading-none">12</span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="bg-innovation-purple text-white px-3 py-1 rounded-full text-label-sm font-bold shadow-lg">Academic Conferences</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-title-lg text-title-lg text-university-blue mb-3">AI &amp; The Future of Higher Ed</h3>
              <div className="space-y-2 mb-6">
                <p className="flex items-center gap-2 text-on-surface-variant text-label-md">
                  <span className="material-symbols-outlined text-sm">location_on</span> Great Auditorium Hall
                </p>
                <p className="flex items-center gap-2 text-on-surface-variant text-label-md">
                  <span className="material-symbols-outlined text-sm">schedule</span> 09:00 AM - 16:00 PM
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-green-600 font-extrabold text-headline-sm">FREE</span>
                <button className="bg-university-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-innovation-purple transition-colors flex items-center gap-2">
                  Register
                  <span className="material-symbols-outlined text-sm">app_registration</span>
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
