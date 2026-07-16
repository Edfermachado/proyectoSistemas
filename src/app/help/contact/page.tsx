import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "./ContactForm";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { systemSettings } from "@/db/schema";
import Link from "next/link";
import Image from "next/image";

export default async function ContactHelpPage() {
  const emailSetting = await db.query.systemSettings.findFirst({
    where: eq(systemSettings.key, "support_email"),
  });
  const supportEmail = emailSetting?.value || "admin@unievents.com";

  return (
    <main className="bg-surface min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-university-blue overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-academic-gold via-transparent to-transparent"></div>
        </div>
        <div className="max-w-container-max mx-auto px-margin-desktop relative z-10 text-on-primary">
          <h1 className="font-display-lg text-5xl mb-4 text-on-primary font-black leading-tight animate-fade-in">
            Contact Us
          </h1>
          <p className="font-body-lg text-lg max-w-2xl text-on-primary-container opacity-90 animate-fade-in" style={{ animationDelay: "100ms" }}>
            We're here to help you make the most of your university experience. Get in touch with the team behind the campus events ecosystem.
          </p>
        </div>
      </section>

      {/* Main Contact Split Layout */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Side: Contact Form */}
          <div className="lg:col-span-7 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <ContactForm supportEmail={supportEmail} />
          </div>

          {/* Right Side: Contact Info Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
            
            {/* Atención al Cliente */}
            <div className="bg-surface-container-low rounded-2xl p-6 border-l-4 border-academic-gold shadow-sm flex items-start gap-4 hover:shadow-md transition-all">
              <div className="bg-university-blue p-2.5 rounded-xl flex items-center justify-center text-on-primary shrink-0">
                <span className="material-symbols-outlined">headset_mic</span>
              </div>
              <div>
                <h3 className="font-title-lg text-lg text-university-blue mb-1 font-bold">Atención al Cliente</h3>
                <p className="text-sm text-slate-500 mb-2 font-medium">Para consultas generales y ayuda con eventos.</p>
                <p className="text-sm text-university-blue font-bold">atencion@campusevents.edu</p>
                <p className="text-sm text-university-blue font-medium">+52 (55) 1234 5678</p>
              </div>
            </div>

            {/* Soporte Técnico */}
            <div className="bg-surface-container-low rounded-2xl p-6 border-l-4 border-innovation-purple shadow-sm flex items-start gap-4 hover:shadow-md transition-all">
              <div className="bg-innovation-purple p-2.5 rounded-xl flex items-center justify-center text-on-primary shrink-0">
                <span className="material-symbols-outlined">settings_suggest</span>
              </div>
              <div>
                <h3 className="font-title-lg text-lg text-university-blue mb-1 font-bold">Soporte Técnico</h3>
                <p className="text-sm text-slate-500 mb-2 font-medium">Reporte de errores o problemas con la plataforma.</p>
                <p className="text-sm text-university-blue font-bold">soporte@campusevents.edu</p>
                <p className="text-sm text-university-blue font-medium">Mon - Fri: 8:00 AM - 6:00 PM</p>
              </div>
            </div>

            {/* Oficinas Centrales */}
            <div className="bg-surface-container-low rounded-2xl p-6 border-l-4 border-university-blue shadow-sm flex items-start gap-4 hover:shadow-md transition-all flex-grow">
              <div className="bg-university-blue p-2.5 rounded-xl flex items-center justify-center text-on-primary shrink-0">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div className="w-full">
                <h3 className="font-title-lg text-lg text-university-blue mb-1 font-bold">Oficinas Centrales</h3>
                <p className="text-sm text-slate-500 mb-2 font-medium">Edificio de Innovación, Campus Norte.</p>
                <p className="text-sm text-university-blue font-bold mb-4">Av. Universidad 100, CP 01230</p>
                <div className="w-full h-36 rounded-xl overflow-hidden relative border border-outline-variant/30">
                  <Image
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                    alt="Campus Office Map"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuArprAyYJUBM8pql6eHdis4JAXAup_tWeTlrSONDBt2putxTV7DMjlEBRY6fgZRaDSy1o49jCgpqafkG-qku3m2zgerY36Qucxuw8TIvNixXKbL5585m6f5uEsIjoTgomIHtUNzovBEdQWozovXwgU5kvxuToWOca6-mLVXBx66x0GnyuduZKHQ8rdnEkW4JFDE14Q8JVJpUEtcw9UE6gICth5O1dUssCTp27XBIKkXdLpzH4rZ2dRn1w"
                  />
                  <div className="absolute inset-0 bg-university-blue/10"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Common Questions (FAQ) Section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20 mb-10 animate-fade-in" style={{ animationDelay: "400ms" }}>
        <div className="text-center mb-12">
          <span className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            Help Center
          </span>
          <h2 className="font-headline-lg text-3xl text-university-blue mt-4 font-bold">
            Common Questions
          </h2>
          <p className="text-base text-on-surface-variant max-w-xl mx-auto mt-2 font-medium">
            Find quick answers to the most frequent inquiries before reaching out to our team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* FAQ Item 1 */}
          <div className="p-6 bg-surface-white border border-outline-variant rounded-2xl hover:border-academic-gold transition-colors duration-300">
            <div className="flex items-center gap-2 mb-3 text-university-blue font-bold">
              <span className="material-symbols-outlined text-lg">help_center</span>
              <h4 className="font-title-lg text-base">¿Cómo recupero mi ticket?</h4>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
              Puedes encontrar todos tus tickets activos en la sección{" "}
              <Link href="/profile" className="text-academic-gold font-bold hover:underline">
                Mi Perfil
              </Link>{" "}
              después de iniciar sesión con tu correo institucional.
            </p>
          </div>

          {/* FAQ Item 2 */}
          <div className="p-6 bg-surface-white border border-outline-variant rounded-2xl hover:border-academic-gold transition-colors duration-300">
            <div className="flex items-center gap-2 mb-3 text-university-blue font-bold">
              <span className="material-symbols-outlined text-lg">group</span>
              <h4 className="font-title-lg text-base">¿Puedo registrar a externos?</h4>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
              Depende de la política de cada evento. Consulta la descripción del evento para ver si se permiten invitados no universitarios.
            </p>
          </div>

          {/* FAQ Item 3 */}
          <div className="p-6 bg-surface-white border border-outline-variant rounded-2xl hover:border-academic-gold transition-colors duration-300">
            <div className="flex items-center gap-2 mb-3 text-university-blue font-bold">
              <span className="material-symbols-outlined text-lg">campaign</span>
              <h4 className="font-title-lg text-base">¿Cómo registro mi facultad?</h4>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
              Para registrar eventos de facultad, debes solicitar una cuenta de "Organizador" a través del formulario de contacto arriba.
            </p>
          </div>

          {/* FAQ Item 4 */}
          <div className="p-6 bg-surface-white border border-outline-variant rounded-2xl hover:border-academic-gold transition-colors duration-300">
            <div className="flex items-center gap-2 mb-3 text-university-blue font-bold">
              <span className="material-symbols-outlined text-lg">payments</span>
              <h4 className="font-title-lg text-base">¿Hay reembolsos?</h4>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
              Las políticas de reembolso son gestionadas directamente por el organizador de cada evento específico.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
