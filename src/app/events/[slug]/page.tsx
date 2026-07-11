import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findEventBySlugOrId } from "@/lib/slug-helpers";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await findEventBySlugOrId(slug);
  if (!event) return { title: "Evento no encontrado" };
  const eDate = new Date(event.date);
  return {
    title: `${event.title} — UniEvents`,
    description: event.description ?? `Asiste a ${event.title} el ${eDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}.`,
    openGraph: {
      title: `${event.title} — UniEvents`,
      description: event.description ?? `Evento organizado por ${event.tenant?.name}.`,
      images: event.imageUrl ? [{ url: event.imageUrl, alt: event.title }] : [],
    },
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await findEventBySlugOrId(slug);
  if (!event) notFound();

  const eDate = new Date(event.date);
  const isFree = event.price?.toUpperCase() === 'FREE' || event.price?.toUpperCase() === 'GRATIS' || event.price === '0';
  
  const endFormat = new Date(eDate.getTime() + event.duration * 60000);
  const timeStr = `${eDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${endFormat.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  const dateStr = eDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  // Use slug for the register URL if available
  const eventSlugOrId = event.slug || event.id;

  return (
    <main className="bg-surface">
      <Header />
      
      {/* Event Header Banner */}
      <section className="relative pt-32 pb-48 bg-university-blue overflow-hidden">
        {event.imageUrl && (
          <div className="absolute inset-0 opacity-20">
            <Image fill className="object-cover" src={event.imageUrl} alt={event.title} />
            <div className="absolute inset-0 bg-university-blue/80 mix-blend-multiply"></div>
          </div>
        )}
        <div className="max-w-container-max mx-auto px-margin-desktop relative z-10 text-center">
          <div className="inline-block bg-academic-gold/20 text-academic-gold px-4 py-1 rounded-full border border-academic-gold/30 mb-6 uppercase tracking-widest font-bold text-xs">
            {event.tenant?.name || "Evento Global"}
          </div>
          <h1 className="font-display-lg text-display-lg text-white max-w-4xl mx-auto mb-6">
            {event.title}
          </h1>
        </div>
      </section>

      {/* Event Content & Card */}
      <section className="max-w-container-max mx-auto px-margin-desktop relative -mt-32 pb-24 flex flex-col lg:flex-row gap-8">
        
        {/* Left Col: Details */}
        <div className="flex-1 bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-outline-variant">
          <h2 className="font-headline-sm text-university-blue mb-6 border-b border-outline-variant pb-4">Acerca de este evento</h2>
          <div className="prose prose-lg text-on-surface-variant max-w-none whitespace-pre-wrap">
            {event.description || "No se ha proporcionado una descripción detallada para este evento."}
          </div>
        </div>

        {/* Right Col: Ticket Card */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-outline-variant sticky top-32">
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center shrink-0 text-university-blue">
                  <span className="material-symbols-outlined">calendar_month</span>
                </div>
                <div>
                  <p className="font-bold text-university-blue capitalize">{dateStr}</p>
                  <p className="text-on-surface-variant text-sm">{timeStr}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center shrink-0 text-university-blue">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <p className="font-bold text-university-blue">{event.space?.name || "Por definir"}</p>
                  <p className="text-on-surface-variant text-sm">Capacidad: {event.space?.capacity || "?"} personas</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center shrink-0 text-university-blue">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <div>
                  <p className="font-bold text-university-blue">Precio de Entrada</p>
                  <p className={`font-black text-xl ${isFree ? "text-green-600" : "text-university-blue"}`}>
                    {isFree ? "GRATIS" : event.price}
                  </p>
                </div>
              </div>
            </div>

            <Link href={`/events/${eventSlugOrId}/register`} className="block">
              <button className="w-full bg-academic-gold text-university-blue py-4 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-md mb-4 flex items-center justify-center gap-2">
                {isFree ? "Inscribirse Ahora" : "Comprar Entrada"}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </Link>
            
            <p className="text-center text-xs text-on-surface-variant">
              Al registrarte aceptas las <Link href="#" className="underline">políticas del evento</Link>.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
