"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function NewSpacePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    fetch('/api/universities').then(r => r.json()).then(setUniversities);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      capacity: parseInt(formData.get("capacity") as string, 10),
      universityId: formData.get("universityId"),
    };

    try {
      const res = await fetch("/api/spaces", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error("Error creating space");
      router.push("/admin/spaces");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error creando el espacio");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Nuevo Espacio Físico</h1>
        <p className="text-on-surface-variant text-body-md">Registra un auditorio, laboratorio o sala.</p>
      </div>

      <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm p-8">
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Nombre del Espacio</label>
            <input name="name" required type="text" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="Ej. Auditorio Principal" />
          </div>
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Capacidad Máxima (personas)</label>
            <input name="capacity" required type="number" min="1" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="100" />
          </div>
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Universidad</label>
            <select name="universityId" required className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest">
              <option value="">-- Selecciona una Universidad --</option>
              {universities.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant/50">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={loading}>{loading ? "Guardando..." : "Crear Espacio"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
