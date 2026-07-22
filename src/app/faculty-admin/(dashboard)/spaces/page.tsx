import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { db } from "@/db";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { spaces as spacesSchema, tenants } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SearchBar } from "@/components/ui/SearchBar";

export default async function FacultySpacesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const session = await getSession();
  if (!session || !session.tenantId) redirect("/login");

  const isAccessControl = session.role === 'access_control';

  const faculty = await db.query.tenants.findFirst({
    where: eq(tenants.id, session.tenantId as string),
  });

  const q = (await searchParams).q?.toLowerCase();
  
  let spacesList = faculty ? await db.query.spaces.findMany({
    where: eq(spacesSchema.tenantId, faculty.id),
    orderBy: (spaces, { desc }) => [desc(spaces.createdAt)],
  }) : [];

  if (q) {
    spacesList = spacesList.filter(s => s.name.toLowerCase().includes(q));
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Mis Espacios</h1>
          <p className="text-on-surface-variant text-body-md">
            Gestiona las locaciones e infraestructuras disponibles en <span className="font-bold text-academic-gold">{faculty?.name || "tu facultad"}</span>.
          </p>
        </div>
        {!isAccessControl && spacesList.length > 0 && (
          <Link href="/faculty-admin/spaces/new">
            <Button variant="primary" icon="location_city">
              Nuevo Espacio
            </Button>
          </Link>
        )}
      </div>

      <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
        <SearchBar placeholder="Buscar por nombre..." />
        
        {spacesList.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-outline text-3xl">location_city</span>
            </div>
            <h3 className="font-title-lg text-university-blue mb-2">No hay espacios registrados</h3>
            <p className="text-on-surface-variant text-label-md max-w-sm">
              Aquí se mostrarán las infraestructuras disponibles para los eventos de tu facultad.
            </p>
            {!isAccessControl && (
              <div className="mt-6">
                <Link href="/faculty-admin/spaces/new">
                  <Button variant="primary" icon="location_city">Agregar Espacio</Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant/50">
                  <th className="px-6 py-4 font-title-sm text-university-blue">Nombre del Espacio</th>
                  <th className="px-6 py-4 font-title-sm text-university-blue">Capacidad</th>
                  <th className="px-6 py-4 text-right font-title-sm text-university-blue">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {spacesList.map((s) => (
                  <tr key={s.id} className="border-b border-outline-variant/50 hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-university-blue">{s.name}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{s.capacity} pers.</td>
                    <td className="px-6 py-4 text-right">
                      {!isAccessControl ? (
                        <>
                          <Link href={`/faculty-admin/spaces/${s.id}/edit`} className="text-university-blue hover:text-innovation-purple p-2 transition-colors">
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </Link>
                          <DeleteButton endpoint="spaces" id={s.id} />
                        </>
                      ) : (
                        <span className="text-xs text-on-surface-variant italic">Solo lectura</span>
                      )}
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
