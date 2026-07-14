import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { attendees } from "@/db/schema";
import { eq } from "drizzle-orm";
import { logoutUser } from "@/app/actions/auth";
import TicketQR from "@/components/TicketQR";

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ viewTicket?: string }> }) {
  const session = await getSession();
  const { viewTicket } = await searchParams;

  if (!session || session.role !== "user") {
    redirect("/login");
  }

  // Fetch registrations matching the session email
  const userRegistrations = await db.query.attendees.findMany({
    where: eq(attendees.email, session.email),
    with: {
      event: {
        with: {
          space: true,
          tenant: {
            with: {
              university: true
            }
          }
        }
      }
    },
    orderBy: (attendees, { desc }) => [desc(attendees.createdAt)]
  });

  const email = session.email;
  const userName = email.split("@")[0];
  const avatarLetter = userName.charAt(0).toUpperCase();

  const registeredEvents = userRegistrations.map((reg) => {
    const ev = reg.event;
    const dateObj = new Date(ev.date);
    const dateStr = dateObj.toLocaleDateString("es-ES", { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = dateObj.toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' });

    return {
      id: reg.id,
      title: ev.title,
      date: dateStr,
      time: timeStr,
      location: ev.space?.name || "Ubicación por definir",
      image: ev.imageUrl || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600",
      status: reg.status === "pending" ? "Pendiente" : "Confirmado",
      tenantName: ev.tenant?.name || "UniEvents",
      ticketToken: reg.ticketToken,
    };
  });

  return (
    <main className="min-h-screen bg-surface-bright pb-20">
      {/* Dark background for header visibility */}
      <div className="h-64 bg-university-blue w-full absolute top-0 z-0 rounded-b-[3rem] overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <Image
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2000"
            alt="University Campus Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-academic-gold/20 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
      </div>
      
      <Header />

      {/* Ticket Modal Overlay */}
      {viewTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-white p-2 rounded-[2rem] shadow-2xl relative max-w-sm w-full mx-auto">
            <Link href="/profile" scroll={false} className="absolute top-4 right-4 z-10 w-8 h-8 bg-surface-container-high rounded-full flex items-center justify-center text-on-surface-variant hover:text-error transition-colors">
              <span className="material-symbols-outlined text-sm">close</span>
            </Link>
            <TicketQR token={viewTicket} />
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32">
        
        {/* Profile Card */}
        <div className="bg-surface-white rounded-3xl shadow-lg p-8 md:p-12 mt-12 flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden border border-surface-container-highest">
           {/* Avatar */}
           <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full bg-gradient-to-tr from-innovation-purple to-university-blue flex items-center justify-center text-white text-5xl font-display-lg font-bold shadow-xl border-4 border-surface-white relative z-10 uppercase">
             {avatarLetter}
           </div>
           
           {/* Info */}
           <div className="flex-1 text-center md:text-left z-10">
             <h1 className="font-display-lg text-headline-lg md:text-display-lg text-on-surface mb-2">{userName}</h1>
             <p className="font-body-lg text-on-surface-variant flex items-center justify-center md:justify-start gap-2 mb-6">
               <span className="material-symbols-outlined text-academic-gold">mail</span>
               {email}
             </p>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg">
               <div className="bg-surface-container-low p-4 rounded-2xl">
                 <p className="text-label-sm text-outline uppercase tracking-wider mb-1">Eventos Asistidos</p>
                 <p className="font-title-lg text-on-surface">{userRegistrations.length}</p>
               </div>
               <div className="bg-surface-container-low p-4 rounded-2xl">
                 <p className="text-label-sm text-outline uppercase tracking-wider mb-1">Miembro Desde</p>
                 <p className="font-title-lg text-on-surface">2026</p>
               </div>
             </div>
           </div>
        </div>

        {/* Dashboard Sections */}
        <div className="mt-16 grid lg:grid-cols-3 gap-8">
          
          {/* Main Content (Events) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display-lg text-headline-lg text-on-surface">Mis Eventos</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-university-blue text-white rounded-full text-sm font-bold shadow-md">Todos</button>
              </div>
            </div>

            <div className="space-y-6">
              {registeredEvents.length === 0 ? (
                 <div className="bg-surface-white rounded-2xl p-8 text-center border border-surface-container-highest">
                   <span className="material-symbols-outlined text-6xl text-outline mb-4">event_busy</span>
                   <h3 className="font-title-lg text-on-surface mb-2">No tienes eventos registrados</h3>
                   <p className="text-on-surface-variant mb-6">Explora los eventos disponibles en las universidades y anímate a participar.</p>
                   <Link href="/events" className="inline-block bg-academic-gold text-university-blue px-6 py-2 rounded-full font-bold text-sm shadow-md hover:scale-105 transition-transform">
                     Explorar Eventos
                   </Link>
                 </div>
              ) : (
                registeredEvents.map((event) => (
                  <div key={event.id} className="bg-surface-white rounded-2xl p-4 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow border border-surface-container-highest group">
                    {/* Event Image */}
                    <div className="relative w-full sm:w-48 h-48 sm:h-auto rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-university-blue flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">confirmation_number</span>
                        {event.status}
                      </div>
                    </div>
                    
                    {/* Event Details */}
                    <div className="flex-1 flex flex-col justify-center py-2 pr-4">
                      <div className="flex items-center gap-4 text-sm font-bold text-academic-gold mb-2">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-lg">calendar_month</span>
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-lg">schedule</span>
                          {event.time}
                        </span>
                      </div>
                      <h3 className="font-headline-md text-title-lg text-on-surface mb-1 line-clamp-2">{event.title}</h3>
                      <p className="text-innovation-purple text-xs font-bold mb-3 uppercase tracking-wider">{event.tenantName}</p>
                      
                      <p className="text-on-surface-variant text-sm flex items-start gap-1 mb-6">
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                        {event.location}
                      </p>
                      
                      <div className="mt-auto flex flex-wrap gap-3">
                        {event.status === "Confirmado" && event.ticketToken ? (
                          <Link href={`/profile?viewTicket=${event.ticketToken}`} scroll={false} className="bg-university-blue/10 hover:bg-university-blue/20 text-university-blue px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                            Ver Entrada
                          </Link>
                        ) : (
                          <span className="text-xs text-on-surface-variant italic py-2">Pendiente de confirmación</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar (Stats / Activity) */}
          <div className="space-y-8">
            <div className="bg-surface-white rounded-3xl p-8 shadow-sm border border-surface-container-highest">
              <h3 className="font-title-lg text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-innovation-purple">analytics</span>
                Mi Actividad
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-academic-gold/20 flex items-center justify-center text-academic-gold">
                      <span className="material-symbols-outlined">local_activity</span>
                    </div>
                    <div>
                      <p className="text-on-surface font-bold">Inscripciones</p>
                      <p className="text-on-surface-variant text-sm">Totales</p>
                    </div>
                  </div>
                  <span className="font-display-lg text-headline-md text-university-blue">{userRegistrations.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-innovation-purple/20 flex items-center justify-center text-innovation-purple">
                      <span className="material-symbols-outlined">stars</span>
                    </div>
                    <div>
                      <p className="text-on-surface font-bold">Puntos UniEvents</p>
                      <p className="text-on-surface-variant text-sm">Nivel Bronce</p>
                    </div>
                  </div>
                  <span className="font-display-lg text-headline-md text-university-blue">{userRegistrations.length * 10}</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gradient-to-r from-innovation-purple/10 to-university-blue/10 rounded-2xl border border-innovation-purple/20">
                <p className="text-sm text-on-surface-variant mb-2">¡Sigue participando para alcanzar el <strong className="text-innovation-purple">Nivel Plata</strong>!</p>
                <div className="w-full bg-surface-variant rounded-full h-2">
                  <div className="bg-innovation-purple h-2 rounded-full" style={{ width: `${Math.min((userRegistrations.length * 10) / 100 * 100, 100)}%` }}></div>
                </div>
              </div>
            </div>

            <div className="bg-surface-white rounded-3xl p-8 shadow-sm border border-surface-container-highest">
               <h3 className="font-title-lg text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-outline">settings</span>
                Preferencias
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="#" className="flex items-center justify-between text-on-surface hover:text-innovation-purple transition-colors">
                    <span className="flex items-center gap-2 font-medium">
                      <span className="material-symbols-outlined">notifications_active</span> Notificaciones
                    </span>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="flex items-center justify-between text-on-surface hover:text-innovation-purple transition-colors">
                    <span className="flex items-center gap-2 font-medium">
                      <span className="material-symbols-outlined">lock</span> Privacidad y Seguridad
                    </span>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </Link>
                </li>
                <li>
                  <form action={logoutUser}>
                    <button type="submit" className="w-full flex items-center justify-between text-error hover:text-error/80 transition-colors pt-4 border-t border-surface-container-highest cursor-pointer">
                      <span className="flex items-center gap-2 font-medium">
                        <span className="material-symbols-outlined">logout</span> Cerrar Sesión
                      </span>
                    </button>
                  </form>
                </li>
              </ul>
            </div>
          </div>
          
        </div>
      </div>
      <Footer />
    </main>
  );
}
