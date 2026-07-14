import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "./ContactForm";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { systemSettings } from "@/db/schema";

export default async function ContactHelpPage() {
  const emailSetting = await db.query.systemSettings.findFirst({
    where: eq(systemSettings.key, "support_email")
  });
  const supportEmail = emailSetting?.value || "admin@unievents.com";

  return (
    <main className="bg-surface min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-university-blue overflow-hidden flex items-center">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-academic-gold via-transparent to-transparent"></div>
        </div>
        <div className="max-w-3xl mx-auto px-margin-desktop relative z-10 text-center space-y-6">
          <div className="w-20 h-20 bg-academic-gold/20 text-academic-gold rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl">contact_support</span>
          </div>
          <h1 className="font-display-lg text-4xl text-surface-white animate-fade-in">
            Centro de Ayuda y Contacto
          </h1>
          <p className="text-white/80 font-body-lg mx-auto animate-fade-in" style={{ animationDelay: "100ms" }}>
            ¿Eres representante de una universidad o facultad y te gustaría implementar UniEvents en tu institución? Estamos aquí para ayudarte con el registro y la integración.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Info Section */}
          <div className="space-y-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div>
              <h2 className="font-headline-md text-university-blue mb-4 text-2xl">Únete a nuestra Red Académica</h2>
              <p className="text-on-surface-variant font-body-md leading-relaxed">
                El acceso al sistema para universidades y facultades es administrado directamente por el <span className="font-bold text-innovation-purple">Administrador Principal (Superadmin)</span> para garantizar la seguridad y veracidad de las instituciones educativas registradas.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 items-start p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm">
                <div className="w-12 h-12 bg-innovation-purple/10 text-innovation-purple rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">domain_add</span>
                </div>
                <div>
                  <h3 className="font-title-lg text-university-blue mb-1">Registro de Universidad</h3>
                  <p className="text-sm text-on-surface-variant">Si tu universidad completa aún no está en nuestra plataforma, crearemos el espacio digital (Tenant principal) exclusivo para ustedes.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm">
                <div className="w-12 h-12 bg-academic-gold/10 text-academic-gold rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">account_balance</span>
                </div>
                <div>
                  <h3 className="font-title-lg text-university-blue mb-1">Inclusión de Facultades</h3>
                  <p className="text-sm text-on-surface-variant">Si tu universidad ya existe pero falta tu facultad en específico, habilitaremos tu portal administrativo (Faculty Admin).</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">shield_person</span>
                </div>
                <div>
                  <h3 className="font-title-lg text-university-blue mb-1">Atención Administrativa</h3>
                  <p className="text-sm text-on-surface-variant">Para recuperación de credenciales de administradores, integraciones de aforos y soporte B2B.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
            <ContactForm supportEmail={supportEmail} />
          </div>
          
        </div>
      </section>

      <Footer />
    </main>
  );
}
