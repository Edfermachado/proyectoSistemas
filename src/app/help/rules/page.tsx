import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reglas de Eventos | UniEvents",
};

export default function EventRulesPage() {
  return (
    <main className="min-h-screen bg-surface-container-lowest flex flex-col">
      <Header />
      <div className="flex-1 max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-32 w-full">
        <Link href="/help" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-university-blue mb-8 transition-colors">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver al Centro de Ayuda
        </Link>
        
        <h1 className="font-display-lg text-university-blue mb-8">Reglas Generales de Eventos</h1>
        
        <div className="space-y-8 text-on-surface bg-surface-white p-8 md:p-12 rounded-3xl border border-outline-variant/50 shadow-sm">
          <section>
            <h2 className="font-title-lg text-innovation-purple mb-4">1. Comportamiento en el Campus</h2>
            <p className="mb-4">Todos los asistentes deben mantener un comportamiento respetuoso acorde con los valores de la institución universitaria. El uso de lenguaje ofensivo, la discriminación y la violencia no serán tolerados y resultarán en la expulsión inmediata del evento sin derecho a reembolso.</p>
          </section>

          <section>
            <h2 className="font-title-lg text-innovation-purple mb-4">2. Ingreso y Entradas</h2>
            <p className="mb-4">Es obligatorio presentar la entrada digital (código QR) en la puerta de acceso al evento junto con el carnet estudiantil institucional (si el tipo de entrada es "Estudiante") o la cédula de identidad vigente.</p>
            <p className="mb-4 text-sm bg-surface-container p-4 rounded-xl border border-outline-variant text-on-surface-variant">Nota: Las entradas son personales e intransferibles a menos que el evento permita explícitamente reasignar la entrada desde el panel del usuario.</p>
          </section>

          <section>
            <h2 className="font-title-lg text-innovation-purple mb-4">3. Prohibiciones</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ingreso y consumo de bebidas alcohólicas y/o estupefacientes dentro de los recintos universitarios.</li>
              <li>Ingreso con armas de cualquier tipo.</li>
              <li>Fumar o usar cigarrillos electrónicos en espacios cerrados y zonas no designadas.</li>
              <li>Alterar el orden público.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-title-lg text-innovation-purple mb-4">4. Derecho de Admisión</h2>
            <p className="mb-4">Los organizadores de cada evento (Facultades) y la seguridad de la universidad se reservan el derecho de admisión y permanencia.</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
