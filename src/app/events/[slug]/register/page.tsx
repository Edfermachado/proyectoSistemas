import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { registerForEvent } from "@/app/actions/attendees.actions";
import { findEventBySlugOrId } from "@/lib/slug-helpers";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await findEventBySlugOrId(slug);
  if (!event) return { title: "Evento no encontrado" };
  return {
    title: `Registro — ${event.title} | UniEvents`,
    description: `Regístrate en ${event.title} organizado por ${event.tenant?.name}.`,
  };
}

export default async function RegisterEventPage({ params, searchParams }: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { slug } = await params;
  const { success } = await searchParams;
  
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  
  const event = await findEventBySlugOrId(slug);
  if (!event) notFound();

  const isFree = event.price?.toUpperCase() === 'FREE' || event.price?.toUpperCase() === 'GRATIS' || event.price === '0';
  const eventSlugOrId = event.slug || event.id;

  async function handleSubmit(formData: FormData) {
    "use server";
    const res = await registerForEvent(formData);
    if (res.success) {
      redirect(`/events/${eventSlugOrId}/register?success=true`);
    }
  }

  return (
    <main className="bg-surface-container-lowest min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center pt-32 pb-20 px-margin-desktop">
        <div className="max-w-xl w-full bg-surface-white rounded-3xl p-8 md:p-12 shadow-xl border border-outline-variant relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-academic-gold/10 rounded-bl-full -translate-y-1/2 translate-x-1/2"></div>
          
          {success ? (
            <div className="text-center space-y-6 animate-fade-in">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-5xl">check_circle</span>
              </div>
              <h2 className="font-display-sm text-university-blue">¡Registro Completado!</h2>
              <p className="text-on-surface-variant font-body-md">
                Te has registrado exitosamente en <strong>{event.title}</strong>.
                {!isFree && " Por favor, realiza tu pago y contacta a la facultad para que confirmen tu entrada."}
              </p>
              <Link href={`/events/${eventSlugOrId}`}>
                <button className="mt-8 bg-university-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-innovation-purple transition-colors">
                  Volver al Evento
                </button>
              </Link>
            </div>
          ) : (
            <>
              <h2 className="font-display-sm text-university-blue mb-2">Completar Registro</h2>
              <p className="text-on-surface-variant mb-8">
                Estás a punto de {isFree ? "inscribirte" : "adquirir una entrada"} para <strong>{event.title}</strong>.
              </p>

              <form action={handleSubmit} className="space-y-6">
                <input type="hidden" name="eventId" value={event.id} />
                
                <div>
                  <label className="block text-label-md font-bold text-university-blue mb-2">Nombre Completo</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">person</span>
                    <input type="text" name="name" required
                      className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-academic-gold focus:ring-2 focus:ring-academic-gold/20 outline-none transition-all"
                      placeholder="Ej. Juan Pérez" />
                  </div>
                </div>

                <div>
                  <label className="block text-label-md font-bold text-university-blue mb-2">Correo Electrónico</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">mail</span>
                    <input type="email" name="email" required
                      value={session.email} readOnly
                      className="w-full pl-12 pr-4 py-3 bg-surface-container-high border border-outline-variant rounded-xl text-on-surface-variant cursor-not-allowed outline-none transition-all"
                      placeholder="ejemplo@universidad.edu" />
                  </div>
                </div>

                <div>
                  <label className="block text-label-md font-bold text-university-blue mb-2">Número de Teléfono</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">phone</span>
                    <input type="tel" name="phone" required
                      className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-academic-gold focus:ring-2 focus:ring-academic-gold/20 outline-none transition-all"
                      placeholder="+58 412 1234567" />
                  </div>
                </div>

                <div>
                  <label className="block text-label-md font-bold text-university-blue mb-2">Tipo de Asistente</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">badge</span>
                    <select name="attendeeType" required
                      className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-academic-gold focus:ring-2 focus:ring-academic-gold/20 outline-none transition-all appearance-none cursor-pointer">
                      <option value="estudiante">Estudiante Universitario</option>
                      <option value="foraneo">Público Foráneo / General</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className="bg-surface-container-high p-4 rounded-xl flex items-center justify-between border border-outline-variant/50">
                  <span className="font-bold text-university-blue">Total a pagar:</span>
                  <span className={`font-black text-xl ${isFree ? 'text-green-600' : 'text-university-blue'}`}>
                    {isFree ? 'GRATIS' : event.price}
                  </span>
                </div>

                <div className="pt-4">
                  <button type="submit"
                    className="w-full bg-academic-gold text-university-blue py-4 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-md flex justify-center items-center gap-2">
                    {isFree ? "Confirmar Inscripción" : "Registrar Compra"}
                    <span className="material-symbols-outlined">check_circle</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
