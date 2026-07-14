"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function EditSpacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [tenants, setTenants] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    fetch(`/api/spaces/${id}`).then(r => r.json()).then(setInitialData);
    fetch('/api/tenants').then(r => r.json()).then(setTenants);
  }, [id]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      capacity: parseInt(formData.get("capacity") as string, 10),
      tenantId: formData.get("tenantId"),
    };

    try {
      const res = await fetch(`/api/spaces/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error("Error");
      router.push("/admin/spaces");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error actualizando el espacio");
    } finally {
      setLoading(false);
    }
  }

  if (!initialData) return <div className="p-8 text-center text-on-surface-variant">Cargando datos...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Editar Espacio</h1>
        <p className="text-on-surface-variant text-body-md">Actualiza la información del lugar.</p>
      </div>

      <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm p-8">
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Nombre del Espacio</label>
            <input name="name" defaultValue={initialData.name} required type="text" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" />
          </div>
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Capacidad Máxima</label>
            <input name="capacity" defaultValue={initialData.capacity} required type="number" min="1" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" />
          </div>
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Facultad Perteneciente</label>
            <select name="tenantId" defaultValue={initialData.tenantId} required className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest">
              {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant/50">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={loading}>{loading ? "Guardando..." : "Actualizar Espacio"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
