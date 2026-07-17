import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y Privacidad | UniEvents",
};

export default function TermsPrivacyPage() {
  return (
    <main className="min-h-screen bg-surface-container-lowest flex flex-col">
      <Header />
      <div className="flex-1 max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-32 w-full">
        <Link href="/help" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-university-blue mb-8 transition-colors">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver al Centro de Ayuda
        </Link>
        
        <h1 className="font-display-lg text-university-blue mb-8">Términos de Servicio y Política de Privacidad</h1>
        
        <div className="space-y-8 text-on-surface bg-surface-white p-8 md:p-12 rounded-3xl border border-outline-variant/50 shadow-sm">
          
          <div className="bg-academic-gold/10 p-4 rounded-xl border border-academic-gold/20 text-university-blue text-sm mb-8">
            Última actualización: Julio de 2026
          </div>

          <section>
            <h2 className="font-title-lg text-university-blue border-b border-outline-variant pb-2 mb-4">1. Aceptación de los Términos</h2>
            <p className="mb-4">Al utilizar la plataforma UniEvents para comprar, reservar o vender entradas, aceptas quedar vinculado a estos Términos de Servicio. Si no estás de acuerdo con estos términos, no utilices nuestros servicios.</p>
          </section>

          <section>
            <h2 className="font-title-lg text-university-blue border-b border-outline-variant pb-2 mb-4">2. Uso de Datos y Privacidad</h2>
            <p className="mb-4">Nos tomamos muy en serio tu privacidad. La información recopilada en esta plataforma se utiliza estrictamente para:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Gestionar tu registro en los eventos.</li>
              <li>Procesar y verificar tus pagos mediante los captures y referencias proporcionados.</li>
              <li>Verificar tu identidad en puerta.</li>
            </ul>
            <p className="mb-4">Tus datos nunca serán vendidos a terceros. Los administradores de las facultades (organizadores) solo tendrán acceso a tu información (nombre, teléfono y correo) para el propósito exclusivo de la gestión de acceso al evento.</p>
          </section>

          <section>
            <h2 className="font-title-lg text-university-blue border-b border-outline-variant pb-2 mb-4">3. Pagos y Reembolsos</h2>
            <p className="mb-4">Los pagos se procesan directamente con los gestores de las facultades mediante Pago Móvil u otras opciones locales estipuladas. UniEvents actúa como una plataforma de intermediación técnica para el registro, pero el flujo del dinero ocurre directamente entre el estudiante y el organizador.</p>
            <p className="mb-4">Las políticas de reembolso de cada evento dependen enteramente de la Facultad organizadora. Debes comunicarte directamente con ellos mediante las opciones de contacto si deseas solicitar una devolución por un evento cancelado.</p>
          </section>

          <section>
            <h2 className="font-title-lg text-university-blue border-b border-outline-variant pb-2 mb-4">4. Seguridad y Cuentas</h2>
            <p className="mb-4">Eres responsable de mantener la seguridad de tu sesión (ya sea iniciada mediante un enlace mágico u otra vía) y de todas las actividades que ocurran bajo tu cuenta. Si sospechas de uso no autorizado, notifica al soporte de UniEvents inmediatamente usando nuestro formulario de contacto.</p>
          </section>

        </div>
      </div>
      <Footer />
    </main>
  );
}
