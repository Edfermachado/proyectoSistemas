"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function FacultyNewSpacePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [faculty, setFaculty] = useState<{id: string, name: string} | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data && data.id) {
          setFaculty(data);
        }
      });
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!faculty) {
      setErrorMsg("No tienes una facultad asignada");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      capacity: parseInt(formData.get("capacity") as string, 10),
      tenantId: faculty.id
    };

    if (isNaN(data.capacity) || data.capacity <= 0) {
      setErrorMsg("La capacidad debe ser un número mayor a 0");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/spaces", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error("Error creando el espacio");
      router.push("/faculty-admin/spaces");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      setErrorMsg("Ocurrió un error al intentar crear el espacio. Revisa los datos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Nuevo Espacio</h1>
        <p className="text-on-surface-variant text-body-md">
          Registra una nueva ubicación para los eventos de <span className="font-bold text-academic-gold">{faculty ? faculty.name : "tu facultad"}</span>.
        </p>
      </div>

      <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm p-8">
        {errorMsg && (
          <div className="mb-6 p-4 bg-error/10 border border-error text-error rounded-xl">
            <strong>Atención:</strong> {errorMsg}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Nombre del Espacio</label>
            <input name="name" required type="text" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="Ej. Auditorio Principal" />
          </div>
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Capacidad Máxima (Personas)</label>
            <input name="capacity" required type="number" min="1" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="Ej. 200" />
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant/50">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={loading || !faculty}>{loading ? "Guardando..." : "Crear Espacio"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
