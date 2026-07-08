import { Button } from "@/components/ui/Button";

export default function UsersPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Directorio de Usuarios</h1>
          <p className="text-on-surface-variant text-body-md">Gestión de accesos y roles administrativos (RBAC).</p>
        </div>
        <Button variant="primary" icon="person_add">
          Nuevo Administrador
        </Button>
      </div>

      <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-outline text-3xl">group</span>
          </div>
          <h3 className="font-title-lg text-university-blue mb-2">Cargando usuarios...</h3>
          <p className="text-on-surface-variant text-label-md max-w-sm">
            En el futuro, aquí verás una tabla con el listado de usuarios de la base de datos.
          </p>
        </div>
      </div>
    </div>
  );
}
