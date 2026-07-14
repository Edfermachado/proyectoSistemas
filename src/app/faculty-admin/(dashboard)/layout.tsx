import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { logoutFacultyAdmin } from '@/app/actions/auth';
import { redirect } from 'next/navigation';

export default async function FacultyAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== 'tenant_admin') redirect('/faculty-admin/login');

  return (
    <div className="flex h-screen bg-background text-on-surface font-body-md overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-surface-container-lowest border-r border-outline-variant flex flex-col shadow-sm z-20">
        <div className="p-8 border-b border-outline-variant/50">
          <h1 className="font-headline-lg text-2xl text-university-blue font-bold tracking-tighter flex items-center gap-3">
            <span className="material-symbols-outlined text-academic-gold text-3xl">school</span>
            UniEvents
          </h1>
          <p className="text-label-sm text-on-surface-variant mt-2 font-bold uppercase tracking-widest">Faculty Portal</p>
        </div>
        <nav className="flex-1 p-6 space-y-3">
          <Link href="/faculty-admin" className="flex items-center gap-4 px-5 py-4 text-on-surface-variant hover:text-university-blue rounded-2xl transition-colors hover:bg-surface-container-high font-medium">
            <span className="material-symbols-outlined text-xl">dashboard</span>
            Dashboard
          </Link>
          <Link href="/faculty-admin/events" className="flex items-center gap-4 px-5 py-4 text-on-surface-variant hover:text-university-blue rounded-2xl transition-colors hover:bg-surface-container-high font-medium">
            <span className="material-symbols-outlined text-xl">local_activity</span>
            Mis Eventos
          </Link>
          <Link href="/faculty-admin/calendar" className="flex items-center gap-4 px-5 py-4 text-on-surface-variant hover:text-university-blue rounded-2xl transition-colors hover:bg-surface-container-high font-medium">
            <span className="material-symbols-outlined text-xl">calendar_month</span>
            Calendario
          </Link>
          <Link href="/faculty-admin/requests" className="flex items-center gap-4 px-5 py-4 text-on-surface-variant hover:text-university-blue rounded-2xl transition-colors hover:bg-surface-container-high font-medium">
            <span className="material-symbols-outlined text-xl">assignment</span>
            Solicitudes
          </Link>
        </nav>
        <div className="p-6 border-t border-outline-variant/50 bg-surface-container-low">
          <form action={logoutFacultyAdmin}>
            <button type="submit" className="flex items-center justify-center gap-3 px-4 py-3 w-full text-error bg-error-container hover:bg-error/90 hover:text-white rounded-xl transition-colors font-bold shadow-sm border border-error/20">
              <span className="material-symbols-outlined">logout</span>
              Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-surface custom-scrollbar relative">
        <header className="glass-header sticky top-0 z-10 px-10 py-5 border-b border-outline-variant/30 flex justify-end items-center text-white shadow-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-academic-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-academic-gold"></span>
              </span>
              <span className="font-label-md text-sm text-surface-variant">System Online</span>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="text-right hidden md:block">
                <p className="font-bold text-sm">{String(session.email)}</p>
                <p className="text-xs text-academic-gold font-bold uppercase tracking-widest">Admin Facultad</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-academic-gold flex items-center justify-center text-university-blue font-black border-2 border-white/20 text-lg shadow-inner uppercase">
                {String(session.email).slice(0, 2)}
              </div>
            </div>
          </div>
        </header>
        <div className="p-10 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
