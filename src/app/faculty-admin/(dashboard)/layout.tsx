import Link from 'next/link';
import { NavLink } from '@/components/ui/NavLink';
import { getSession } from '@/lib/auth';
import { logoutFacultyAdmin } from '@/app/actions/auth';
import { redirect } from 'next/navigation';

export default async function FacultyAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || !['tenant_admin', 'event_manager', 'access_control'].includes(session.role as string)) redirect('/login');

  return (
    <div className="flex h-screen bg-background text-on-surface font-body-md overflow-hidden relative">
      {/* Mobile Sidebar Toggle */}
      <input type="checkbox" id="mobile-sidebar-toggle" className="peer hidden" />

      {/* Overlay */}
      <label htmlFor="mobile-sidebar-toggle" className="md:hidden fixed inset-0 bg-black/50 z-30 hidden peer-checked:block"></label>

      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 transform -translate-x-full peer-checked:translate-x-0 md:relative md:translate-x-0 transition-transform duration-300 w-72 bg-surface-container-lowest border-r border-outline-variant flex flex-col shadow-sm z-40">
        <Link href="/" className="block p-8 border-b border-outline-variant/50 hover:bg-surface-container-lowest/50 transition-colors">
          <h1 className="font-headline-lg text-2xl text-university-blue font-bold tracking-tighter flex items-center gap-3">
            <span className="material-symbols-outlined text-academic-gold text-3xl">school</span>
            UniEvents
          </h1>
          <p className="text-label-sm text-on-surface-variant mt-2 font-bold uppercase tracking-widest">Faculty Portal</p>
        </Link>
        <nav className="flex-1 p-6 space-y-3 overflow-y-auto scrollbar-hide">
          {session.role !== 'access_control' && (
            <>
              <NavLink href="/faculty-admin" icon="dashboard" exact>
                Dashboard
              </NavLink>
              <NavLink href="/faculty-admin/metrics" icon="bar_chart">
                Métricas Estratégicas
              </NavLink>
              <NavLink href="/faculty-admin/events" icon="local_activity">
                Mis Eventos
              </NavLink>
              <NavLink href="/faculty-admin/calendar" icon="calendar_month">
                Calendario
              </NavLink>
              <NavLink href="/faculty-admin/requests" icon="assignment">
                Solicitudes
              </NavLink>
              {session.role === 'tenant_admin' && (
                <>
                  <NavLink href="/faculty-admin/managers" icon="manage_accounts">
                    Gestores de Eventos
                  </NavLink>
                  <NavLink href="/faculty-admin/audit" icon="history_toggle_off">
                    Auditoría de QRs
                  </NavLink>
                </>
              )}
            </>
          )}
          {session.role === 'access_control' && (
            <NavLink href="/faculty-admin/events" icon="group">
              Eventos y Asistentes
            </NavLink>
          )}
          <NavLink href="/faculty-admin/scanner" icon="qr_code_scanner">
            Escáner QR
          </NavLink>
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
      <main className="flex-1 overflow-y-auto bg-surface scrollbar-hide relative">
        <header className="glass-header sticky top-0 z-10 px-4 md:px-10 py-5 border-b border-outline-variant/30 flex justify-between md:justify-end items-center text-white shadow-sm">
          <label htmlFor="mobile-sidebar-toggle" className="md:hidden cursor-pointer flex items-center bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors">
            <span className="material-symbols-outlined">menu</span>
          </label>
          <div className="flex items-center gap-4 md:gap-6">
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
                <p className="text-xs text-academic-gold font-bold uppercase tracking-widest">
                  {session.role === 'tenant_admin' ? 'Admin Facultad' : session.role === 'event_manager' ? 'Gestor Eventos' : 'Control Acceso'}
                </p>
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
