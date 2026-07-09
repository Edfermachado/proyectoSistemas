import { Button } from "@/components/ui/Button";
import { db } from "@/db";
import Link from "next/link";

export default async function UniversitiesPage() {
  const universitiesList = await db.query.universities.findMany({
    orderBy: (universities, { desc }) => [desc(universities.createdAt)],
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Gestión de Universidades</h1>
          <p className="text-on-surface-variant text-body-md">Administra las instituciones principales (Multi-Universidad).</p>
        </div>
        <Link href="/admin/universities/new">
          <Button variant="primary" icon="account_balance">
            Nueva Universidad
          </Button>
        </Link>
      </div>

      <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
        {universitiesList.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-outline text-3xl">account_balance</span>
            </div>
            <h3 className="font-title-lg text-university-blue mb-2">No hay universidades registradas</h3>
            <p className="text-on-surface-variant text-label-md max-w-sm">
              Agrega una universidad central para poder asignarle facultades.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant/50">
                  <th className="px-6 py-4 font-title-sm text-university-blue">Nombre</th>
                  <th className="px-6 py-4 font-title-sm text-university-blue">Descripción</th>
                  <th className="px-6 py-4 text-right font-title-sm text-university-blue">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {universitiesList.map((u) => (
                  <tr key={u.id} className="border-b border-outline-variant/50 hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-university-blue">{u.name}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{u.description || "-"}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-university-blue hover:text-innovation-purple p-2 transition-colors">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button className="text-error hover:text-error/80 p-2 ml-2 transition-colors">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
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
