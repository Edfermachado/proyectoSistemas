import Image from "next/image";

export default function FeaturedEvents() {
  const events = [
    {
      id: 1,
      image: "/images/event_basketball.png",
      month: "Jun",
      day: "28",
      category: "Deportes Inter-Uni",
      title: "Finales de la Copa Universitaria de Baloncesto",
      location: "Arena Multideportiva",
      time: "18:00 - 21:00",
      price: "$12.50",
    },
    {
      id: 2,
      image: "/images/event_gala.png",
      month: "Jul",
      day: "05",
      category: "Festivales",
      title: "Vibras de Verano: Gala de Artes",
      location: "Jardines del Ala Oeste",
      time: "20:00 - 02:00",
      price: "$25.00",
    },
    {
      id: 3,
      image: "/images/event_ai.png",
      month: "Jul",
      day: "12",
      category: "Académico",
      title: "IA y el Futuro de la Educación",
      location: "Gran Auditorio",
      time: "09:00 - 16:00",
      price: "GRATIS",
      isFree: true,
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-container-max mx-auto px-margin-desktop">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-university-blue mb-4">
              Eventos Destacados
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-lg">
              Experiencias seleccionadas de todos los departamentos y facultades.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2 rounded-full border border-university-blue text-university-blue font-semibold hover:bg-university-blue hover:text-white transition-all">
              Hoy
            </button>
            <button className="px-6 py-2 rounded-full bg-university-blue text-white font-semibold shadow-md">
              Este Fin de Semana
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((evt) => (
            <article
              key={evt.id}
              className="event-card-hover bg-surface-white rounded-2xl overflow-hidden shadow-sm border border-outline-variant group"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  src={evt.image}
                  alt={evt.title}
                />
                <div className="absolute top-4 left-4 bg-surface-white rounded-xl p-2 text-center shadow-md border border-outline-variant min-w-[50px]">
                  <span className="block text-university-blue font-bold text-label-sm leading-tight uppercase">
                    {evt.month}
                  </span>
                  <span className="block text-university-blue font-black text-headline-sm leading-none">
                    {evt.day}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-innovation-purple text-white px-3 py-1 rounded-full text-label-sm font-bold shadow-lg">
                    {evt.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-title-lg text-title-lg text-university-blue mb-3 group-hover:text-innovation-purple transition-colors">
                  {evt.title}
                </h3>
                <div className="space-y-2 mb-6">
                  <p className="flex items-center gap-2 text-on-surface-variant text-label-md">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {evt.location}
                  </p>
                  <p className="flex items-center gap-2 text-on-surface-variant text-label-md">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    {evt.time}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`font-extrabold text-headline-sm ${
                      evt.isFree ? "text-green-600" : "text-university-blue"
                    }`}
                  >
                    {evt.price}
                  </span>
                  <button className="bg-university-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-innovation-purple transition-colors flex items-center gap-2">
                    {evt.isFree ? "Inscribirse" : "Comprar Entrada"}
                    <span className="material-symbols-outlined text-sm">
                      {evt.isFree ? "app_registration" : "shopping_cart"}
                    </span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
