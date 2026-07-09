import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { db } from "@/db";
import Link from "next/link";

export default async function UsersPage() {
  const users = await db.query.users.findMany({
    with: { tenant: true },
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Directorio de Usuarios</h1>
          <p className="text-on-surface-variant text-body-md">Gestión de accesos y roles administrativos (RBAC).</p>
        </div>
        <Link href="/admin/users/new">
          <Button variant="primary" icon="person_add">
            Nuevo Administrador
          </Button>
        </Link>
      </div>

      <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
        {users.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-outline text-3xl">group</span>
            </div>
            <h3 className="font-title-lg text-university-blue mb-2">No hay usuarios</h3>
            <p className="text-on-surface-variant text-label-md max-w-sm">
              No se han encontrado usuarios registrados.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant/50">
                  <th className="px-6 py-4 font-title-sm text-university-blue">Email</th>
                  <th className="px-6 py-4 font-title-sm text-university-blue">Rol</th>
                  <th className="px-6 py-4 font-title-sm text-university-blue">Facultad</th>
                  <th className="px-6 py-4 text-right font-title-sm text-university-blue">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-outline-variant/50 hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-university-blue">{u.email}</td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      <span className="px-3 py-1 bg-academic-gold/20 text-academic-gold rounded-full text-xs font-bold uppercase">{u.role}</span>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">{u.tenant?.name || "Global"}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/users/${u.id}/edit`} className="text-university-blue hover:text-innovation-purple p-2 transition-colors">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </Link>
                      <DeleteButton endpoint="users" id={u.id} />
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
