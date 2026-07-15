import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { redirect } from "next/navigation";

export default async function ManagersPage() {
  const session = await getSession();
  if (!session || session.role !== 'tenant_admin' || !session.tenantId) {
    redirect('/login');
  }

  const managers = await db.query.users.findMany({
    where: and(
      eq(users.tenantId, session.tenantId as string),
      inArray(users.role, ['event_manager', 'access_control'])
    ),
    orderBy: (u, { desc }) => [desc(u.createdAt)],
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Gestores de Eventos</h1>
          <p className="text-on-surface-variant text-body-md">Administra las cuentas autorizadas para gestionar y registrar eventos.</p>
        </div>
        <Link href="/faculty-admin/managers/new">
          <Button variant="primary" icon="add">Nuevo Gestor</Button>
        </Link>
      </div>

      <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
        {managers.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-outline text-3xl">manage_accounts</span>
            </div>
            <h3 className="font-title-lg text-university-blue mb-2">No hay gestores registrados</h3>
            <p className="text-on-surface-variant text-label-md max-w-sm mb-6">
              Agrega usuarios que puedan proponer eventos, validarlos una vez aprobados y gestionar las listas de asistencia.
            </p>
            <Link href="/faculty-admin/managers/new">
              <Button variant="secondary" icon="add">Crear Gestor</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant/50">
                  <th className="px-6 py-4 font-title-sm text-university-blue">Correo Electrónico</th>
                  <th className="px-6 py-4 font-title-sm text-university-blue">Rol Asignado</th>
                  <th className="px-6 py-4 font-title-sm text-university-blue">Fecha de Registro</th>
                  <th className="px-6 py-4 text-right font-title-sm text-university-blue">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {managers.map((m) => (
                  <tr key={m.id} className="border-b border-outline-variant/50 hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-university-blue">{m.email}</td>
                    <td className="px-6 py-4 text-on-surface-variant uppercase text-xs tracking-wider font-bold">
                      {m.role === 'access_control' ? 'Control de Acceso' : 'Administrador de Eventos'}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">{m.createdAt?.toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <DeleteButton endpoint="users" id={m.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
