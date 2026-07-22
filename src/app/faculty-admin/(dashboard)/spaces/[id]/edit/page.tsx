"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function FacultyEditSpacePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [initialData, setInitialData] = useState<{name: string, capacity: number} | null>(null);

  useEffect(() => {
    fetch(`/api/spaces/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data && !data.error) {
          setInitialData(data);
        } else {
          setErrorMsg("No se pudo cargar la información del espacio.");
        }
      })
      .catch(() => setErrorMsg("Error de conexión al cargar el espacio."));
  }, [id]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      capacity: parseInt(formData.get("capacity") as string, 10),
    };

    if (isNaN(data.capacity) || data.capacity <= 0) {
      setErrorMsg("La capacidad debe ser un número mayor a 0");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/spaces/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error("Error actualizando el espacio");
      router.push("/faculty-admin/spaces");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      setErrorMsg("Ocurrió un error al intentar actualizar el espacio.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Editar Espacio</h1>
        <p className="text-on-surface-variant text-body-md">
          Modifica los detalles de este espacio físico.
        </p>
      </div>

      <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm p-8">
        {errorMsg && (
          <div className="mb-6 p-4 bg-error/10 border border-error text-error rounded-xl">
            <strong>Atención:</strong> {errorMsg}
          </div>
        )}

        {!initialData && !errorMsg ? (
          <div className="py-8 text-center text-on-surface-variant">Cargando información...</div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block font-title-sm text-university-blue mb-2">Nombre del Espacio</label>
              <input name="name" required defaultValue={initialData?.name} type="text" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="Ej. Auditorio Principal" />
            </div>
            <div>
              <label className="block font-title-sm text-university-blue mb-2">Capacidad Máxima (Personas)</label>
              <input name="capacity" required defaultValue={initialData?.capacity} type="number" min="1" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="Ej. 200" />
            </div>
            <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant/50">
              <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
              <Button type="submit" variant="primary" disabled={loading || !initialData}>{loading ? "Guardando..." : "Actualizar Espacio"}</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
