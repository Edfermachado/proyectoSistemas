import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/ui/DeleteButton";
import Link from "next/link";
import { db } from "@/db";

export default async function CategoriesPage() {
  const categories = await db.query.categories.findMany({
    orderBy: (categories, { desc }) => [desc(categories.createdAt)],
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Gestión de Categorías</h1>
          <p className="text-on-surface-variant text-body-md">Administra las categorías para agrupar facultades.</p>
        </div>
        {categories.length > 0 && (
          <Link href="/admin/categories/new">
            <Button variant="primary" icon="add">
              Nueva Categoría
            </Button>
          </Link>
        )}
      </div>

      <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-outline text-3xl">category</span>
            </div>
            <h3 className="font-title-lg text-university-blue mb-2">No hay categorías registradas</h3>
            <p className="text-on-surface-variant text-label-md max-w-sm mb-6">
              Crea categorías como "Ingeniería", "Medicina" o "Artes" para agrupar mejor a las facultades.
            </p>
            <Link href="/admin/categories/new">
              <Button variant="primary" icon="add">Crear Categoría</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant/50">
                  <th className="px-6 py-4 font-title-sm text-university-blue">Icono</th>
                  <th className="px-6 py-4 font-title-sm text-university-blue">Nombre</th>
                  <th className="px-6 py-4 font-title-sm text-university-blue">Slug</th>
                  <th className="px-6 py-4 font-title-sm text-university-blue">Fecha de Registro</th>
                  <th className="px-6 py-4 text-right font-title-sm text-university-blue">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id} className="border-b border-outline-variant/50 hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="px-6 py-4 text-university-blue">
                      {c.icon && <span className="material-symbols-outlined">{c.icon}</span>}
                    </td>
                    <td className="px-6 py-4 font-medium text-university-blue">{c.name}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{c.slug}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{c.createdAt?.toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      {/* TODO: Implement edit later if needed */}
                      <DeleteButton endpoint="categories" id={c.id} />
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
