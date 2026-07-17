import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Centro de Ayuda | UniEvents",
  description: "Encuentra respuestas, guías y contacta a soporte.",
};

export default function HelpCenterPage() {
  return (
    <main className="min-h-screen bg-surface-container-lowest flex flex-col">
      <Header />
      <div className="flex-1 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-32 w-full">
        <h1 className="font-display-lg text-university-blue mb-4 text-center">Centro de Ayuda</h1>
        <p className="text-on-surface-variant text-center max-w-2xl mx-auto mb-16 text-lg">
          ¿Cómo podemos ayudarte hoy? Explora nuestros recursos o ponte en contacto con el equipo de soporte técnico.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Link href="/help/rules" className="bg-surface-white p-8 rounded-3xl shadow-sm border border-outline-variant/50 hover:shadow-md transition-shadow group">
            <span className="material-symbols-outlined text-4xl text-academic-gold mb-4 group-hover:scale-110 transition-transform">rule</span>
            <h2 className="font-title-lg text-university-blue mb-2">Reglas de Eventos</h2>
            <p className="text-on-surface-variant text-sm">Conoce las normativas generales aplicables a los eventos organizados dentro del campus universitario.</p>
          </Link>

          <Link href="/help/terms" className="bg-surface-white p-8 rounded-3xl shadow-sm border border-outline-variant/50 hover:shadow-md transition-shadow group">
            <span className="material-symbols-outlined text-4xl text-innovation-purple mb-4 group-hover:scale-110 transition-transform">gavel</span>
            <h2 className="font-title-lg text-university-blue mb-2">Términos y Privacidad</h2>
            <p className="text-on-surface-variant text-sm">Infórmate sobre cómo manejamos tus datos, condiciones del servicio y políticas de reembolso.</p>
          </Link>

          <Link href="/help/contact" className="bg-surface-white p-8 rounded-3xl shadow-sm border border-outline-variant/50 hover:shadow-md transition-shadow group">
            <span className="material-symbols-outlined text-4xl text-university-blue mb-4 group-hover:scale-110 transition-transform">support_agent</span>
            <h2 className="font-title-lg text-university-blue mb-2">Contáctanos</h2>
            <p className="text-on-surface-variant text-sm">¿Tienes algún problema técnico o necesitas ayuda con un reembolso? Escríbenos.</p>
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
