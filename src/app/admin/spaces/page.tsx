import { Button } from "@/components/ui/Button";

export default function SpacesPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Infraestructura y Espacios</h1>
          <p className="text-on-surface-variant text-body-md">Gestión de auditorios, laboratorios y recintos deportivos.</p>
        </div>
        <Button variant="primary" icon="location_city">
          Nuevo Espacio
        </Button>
      </div>

      <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-outline text-3xl">location_city</span>
          </div>
          <h3 className="font-title-lg text-university-blue mb-2">Tabla de Espacios Físicos</h3>
          <p className="text-on-surface-variant text-label-md max-w-sm">
            Aquí se mostrarán las infraestructuras disponibles para los eventos.
          </p>
        </div>
      </div>
    </div>
  );
}
