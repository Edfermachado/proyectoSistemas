import Image from "next/image";
import HeroCarousel from "./HeroCarousel";
import { db } from "@/db";
import { count } from "drizzle-orm";
import { attendees, events } from "@/db/schema";

export default async function Hero() {
  // Get dynamic attendee count
  const attendeesCountResult = await db.select({ value: count() }).from(attendees);
  const totalAttendees = attendeesCountResult[0].value || 0;
  
  // Format the number (e.g., 1500 -> "1.5k", 500 -> "500")
  const formattedAttendees = totalAttendees >= 1000 
    ? `${(totalAttendees / 1000).toFixed(1).replace('.0', '')}k` 
    : totalAttendees.toString();

  // Get recent events for the carousel
  const recentEventsRaw = await db.query.events.findMany({
    orderBy: (events, { desc }) => [desc(events.createdAt)],
    limit: 4,
    with: { space: true }
  });

  const carouselEvents = recentEventsRaw.map(e => ({
    id: e.id,
    title: e.title,
    imageUrl: e.imageUrl,
    spaceName: e.space?.name
  }));

  return (
    <section className="relative pt-24 pb-12 overflow-hidden bg-university-blue min-h-[85vh] flex items-center">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none"></div>
      <div className="max-w-container-max mx-auto px-margin-desktop grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
        <div className="space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-academic-gold/20 text-academic-gold px-4 py-1 rounded-full border border-academic-gold/30">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              stars
            </span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest">Tendencias en el Campus</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-surface-white">
            Vive tu <span className="text-academic-gold">Experiencia Universitaria</span> al Máximo.
          </h1>
          <p className="font-body-lg text-body-lg text-on-primary-container/80 max-w-xl">
            Desde campeonatos importantes hasta galas nocturnas de la facultad, encuentra cada boleto para los momentos que definen tu vida estudiantil.
          </p>
          <form action="/events" method="GET" className="bg-surface-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-2xl border border-outline-variant">
            <div className="flex-1 flex items-center px-4 pb-2 md:pb-0 border-b md:border-b-0 md:border-r border-outline-variant/50">
              <span className="material-symbols-outlined text-university-blue mr-3">school</span>
              <input
                type="text"
                name="q"
                placeholder="Buscar por Evento, Facultad o Universidad"
                className="w-full border-none focus:ring-0 text-body-md py-3 text-university-blue focus:outline-none"
              />
            </div>
            <button type="submit" className="bg-university-blue text-surface-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-innovation-purple transition-all duration-300">
              <span className="material-symbols-outlined">search</span>
              Buscar Eventos
            </button>
          </form>
          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-4">
              <div className="w-10 h-10 rounded-full border-2 border-university-blue bg-slate-500 overflow-hidden relative">
                <Image
                  fill
                  sizes="40px"
                  className="object-cover"
                  alt="Student 1"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDono8M6zN8lr0aqzEqWJmvmLIvXohTtVrXorEqeMpn6gjn5UqI0mGTj7i7jW2i64_xUjdt9OItKjbfjPGONLC5xBLAgrHluUFZoPwtHz9oHIz-T5LTBmD5dyKexdMHe0l1pq0pVedyw6qFhLNEMUzLlFT0ySjSry7IVh7C9HCAHrJl0xM8T1p0QREDSXb_QlKbTzxwuWucuqeG4EYGjfcnenfKxvaJD7reDwLsNgCDvGXMdgrXIC7ymre6orjpPDvYyerQxao_90WY"
                />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-university-blue bg-slate-500 overflow-hidden relative">
                <Image
                  fill
                  sizes="40px"
                  className="object-cover"
                  alt="Student 2"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoclTX8cfYm9iuXp-7J2QroeNVSQJidV13UfabBG2nXBL8c7VbXp12IN3A3M2jrGpWtn7p_ju4KpiyfDAyedDZISwOYsv7BV76RFvDNnp7NgsfvabgqvtBke6LdpApmp9VHhnvweVCrFVUTmDgJArmgl5Yl3EFIfeV3d9tRXR-BXxNRvtQqAmfRIEo0KimjDFd5-XdAfcrNhN2HQKym6rY8ITPYTOqwFCBwPCFTohPhtPY51soLVyMbayemgz1luWlyIBJgxV3KwR6"
                />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-university-blue bg-slate-500 overflow-hidden relative">
                <Image
                  fill
                  sizes="40px"
                  className="object-cover"
                  alt="Student 3"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2J7L-Twl-3etlhKNtRhe1CBmKwtgueDeLlW3GqmydirWYxDkJ3HkzC5rOBfjEdcYIdSvaDIW7_G9xir9FK0XnKsO3HoJeLpMzQat7-xeJ2OnLc0RKjwdYgnTLR9oJoWvIVAdPuM_mCdL8Rl4SpIr9iQHHZZLcIGGQso8RLI4jtDT0gMtrUPwaidl_C6wB-d379_r7TxXWusQ872y8WEz6jxZxqq9K4aGGEmgOkFLLbGSsHIrNS7SN4Ma0rBT91kvvtGpy9inWeIHZ"
                />
              </div>
            </div>
            <p className="text-on-primary-container/60 text-label-md font-medium">
              {totalAttendees > 0 
                ? `+${formattedAttendees} estudiantes ya reservaron`
                : "Sé el primero en reservar"}
            </p>
          </div>
        </div>
        
        {/* Carousel Component */}
        <HeroCarousel events={carouselEvents} />
        
      </div>
    </section>
  );
}
