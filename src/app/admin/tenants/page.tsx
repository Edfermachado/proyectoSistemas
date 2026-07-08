import { Button } from "@/components/ui/Button";

export default function TenantsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Gestión de Facultades</h1>
          <p className="text-on-surface-variant text-body-md">Administra las organizaciones y departamentos universitarios.</p>
        </div>
        <Button variant="primary" icon="add">
          Nueva Facultad
        </Button>
      </div>

      <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant/50 bg-surface-container-lowest">
          <input 
            type="text" 
            placeholder="Buscar por nombre..." 
            className="w-full md:w-1/3 px-4 py-2 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold text-label-md"
          />
        </div>
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-outline text-3xl">account_balance</span>
          </div>
          <h3 className="font-title-lg text-university-blue mb-2">No hay facultades registradas</h3>
          <p className="text-on-surface-variant text-label-md max-w-sm mb-6">
            Comienza agregando la primera facultad para habilitar la creación de espacios y eventos.
          </p>
          <Button variant="secondary" icon="add">Agregar Facultad</Button>
        </div>
      </div>
    </div>
  );
}
