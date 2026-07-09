import Link from 'next/link';
import { db } from '@/db';
import { tenants, users, events, spaces } from '@/db/schema';
import { count } from 'drizzle-orm';

export default async function AdminDashboard() {
  // Fetch real metrics from the database
  const [tenantsCount] = await db.select({ value: count() }).from(tenants);
  const [usersCount] = await db.select({ value: count() }).from(users);
  const [eventsCount] = await db.select({ value: count() }).from(events);
  const [spacesCount] = await db.select({ value: count() }).from(spaces);

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-headline-lg text-university-blue mb-3 text-4xl">Dashboard Global</h1>
          <p className="text-on-surface-variant text-body-lg max-w-2xl">
            Bienvenido al centro de mando. Aquí puedes visualizar las métricas clave y gestionar las entidades principales de todas las facultades.
          </p>
        </div>
        <button className="hidden md:flex items-center gap-2 bg-university-blue text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-innovation-purple hover:-translate-y-1 transition-all duration-300">
          <span className="material-symbols-outlined">download</span>
          Exportar Reporte
        </button>
      </div>

      {/* Métricas Globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Facultades" value={tenantsCount.value.toString()} icon="account_balance" color="text-innovation-purple" bg="bg-innovation-purple/10" />
        <MetricCard title="Usuarios" value={usersCount.value.toString()} icon="group" color="text-university-blue" bg="bg-university-blue/10" />
        <MetricCard title="Eventos Activos" value={eventsCount.value.toString()} icon="event" color="text-academic-gold" bg="bg-academic-gold/20" />
        <MetricCard title="Espacios Físicos" value={spacesCount.value.toString()} icon="location_on" color="text-emerald-600" bg="bg-emerald-100" />
      </div>

      {/* Accesos Rápidos (Quick Links) */}
      <div className="mt-16 bg-surface-white p-8 rounded-3xl shadow-sm border border-outline-variant">
        <h2 className="font-headline-md text-university-blue mb-8 flex items-center gap-3">
          <span className="material-symbols-outlined text-academic-gold">bolt</span>
          Accesos Rápidos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/tenants" className="event-card-hover bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant flex items-center justify-between group shadow-sm">
            <div>
              <h3 className="font-title-lg text-university-blue group-hover:text-innovation-purple transition-colors">Gestionar Facultades</h3>
              <p className="text-label-sm text-on-surface-variant mt-2">Crear o editar facultades del campus</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-innovation-purple/10 transition-colors">
              <span className="material-symbols-outlined text-university-blue group-hover:text-innovation-purple">arrow_forward</span>
            </div>
          </Link>

          <Link href="/admin/users" className="event-card-hover bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant flex items-center justify-between group shadow-sm">
            <div>
              <h3 className="font-title-lg text-university-blue group-hover:text-innovation-purple transition-colors">Administradores</h3>
              <p className="text-label-sm text-on-surface-variant mt-2">Asignar roles y accesos</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-innovation-purple/10 transition-colors">
              <span className="material-symbols-outlined text-university-blue group-hover:text-innovation-purple">arrow_forward</span>
            </div>
          </Link>
          
          <Link href="/admin/events" className="event-card-hover bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant flex items-center justify-between group shadow-sm">
            <div>
              <h3 className="font-title-lg text-university-blue group-hover:text-innovation-purple transition-colors">Auditoría de Eventos</h3>
              <p className="text-label-sm text-on-surface-variant mt-2">Monitoreo global de actividades</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-innovation-purple/10 transition-colors">
              <span className="material-symbols-outlined text-university-blue group-hover:text-innovation-purple">arrow_forward</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color, bg }: { title: string, value: string, icon: string, color: string, bg: string }) {
  return (
    <div className="event-card-hover bg-surface-white p-6 rounded-3xl border border-outline-variant shadow-sm flex items-center gap-6 relative overflow-hidden">
      {/* Decorative background circle */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${bg} opacity-50 blur-xl`}></div>
      
      <div className={`w-16 h-16 rounded-2xl ${bg} flex items-center justify-center relative z-10 border border-white`}>
        <span className={`material-symbols-outlined text-3xl ${color}`}>{icon}</span>
      </div>
      <div className="relative z-10">
        <p className="text-label-sm text-on-surface-variant font-bold uppercase tracking-widest">{title}</p>
        <p className={`font-headline-lg text-4xl mt-1 font-extrabold ${color}`}>{value}</p>
      </div>
    </div>
  );
}
