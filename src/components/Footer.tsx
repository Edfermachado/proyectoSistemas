import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-university-blue text-on-primary">
      <div className="w-full py-stack-xl px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter max-w-container-max mx-auto">
        <div className="space-y-6">
          <h3 className="font-headline-sm text-headline-sm font-bold text-academic-gold">
            UniEvents
          </h3>
          <p className="text-surface-variant text-label-sm max-w-xs">
            La plataforma principal de venta de entradas para eventos construida exclusivamente para la comunidad universitaria. Empoderando la conexión estudiantil a través de experiencias.
          </p>
          <div className="flex gap-4">
            <Link
              href="#"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-academic-gold transition-colors text-white"
            >
              <span className="material-symbols-outlined">share</span>
            </Link>
            <Link
              href="#"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-academic-gold transition-colors text-white"
            >
              <span className="material-symbols-outlined">hub</span>
            </Link>
            <Link
              href="#"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-academic-gold transition-colors text-white"
            >
              <span className="material-symbols-outlined">alternate_email</span>
            </Link>
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 font-title-lg">Plataforma</h4>
          <ul className="space-y-4 font-label-sm text-label-sm">
            <li>
              <Link href="#" className="text-surface-variant hover:text-academic-gold transition-all">
                Explorar Eventos
              </Link>
            </li>
            <li>
              <Link href="#" className="text-surface-variant hover:text-academic-gold transition-all">
                Universidades Asociadas
              </Link>
            </li>
            <li>
              <Link href="#" className="text-surface-variant hover:text-academic-gold transition-all">
                Verificación de Entradas
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-surface-variant hover:text-academic-gold transition-all">
                Panel de Facultad
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 font-title-lg">Recursos</h4>
          <ul className="space-y-4 font-label-sm text-label-sm">
            <li>
              <Link href="/help" className="text-surface-variant hover:text-academic-gold transition-all">
                Centro de Ayuda
              </Link>
            </li>
            <li>
              <Link href="/help/rules" className="text-surface-variant hover:text-academic-gold transition-all">
                Reglas de Eventos
              </Link>
            </li>
            <li>
              <Link href="/help/terms" className="text-surface-variant hover:text-academic-gold transition-all">
                Términos y Privacidad
              </Link>
            </li>
            <li>
              <Link href="/help/contact" className="text-surface-variant hover:text-academic-gold transition-all">
                Contáctanos
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-6">
          <h4 className="text-white font-bold mb-6 font-title-lg">Mantente Informado</h4>
          <p className="text-surface-variant text-label-sm">
            Recibe el resumen semanal del campus en tu correo.
          </p>
          <form className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="estudiante@universidad.edu"
              className="bg-white/10 border-white/20 rounded-xl px-4 py-3 text-white focus:ring-academic-gold focus:border-academic-gold focus:outline-none"
            />
            <button className="bg-academic-gold text-university-blue font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">
              Suscribirse
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-primary-container max-w-container-max mx-auto px-margin-desktop py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-surface-variant text-label-sm opacity-80">
          © 2024 UniEvents Ticketing. Todos los derechos reservados.
        </p>
        <div className="flex gap-8 text-surface-variant text-label-sm font-semibold">
          <Link href="/login" className="hover:text-white">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
