"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [initialData, setInitialData] = useState<any>(null);
  const [tenants, setTenants] = useState<{id: string, name: string}[]>([]);
  const [spaces, setSpaces] = useState<{id: string, name: string}[]>([]);
  const [selectedTenant, setSelectedTenant] = useState("");

  useEffect(() => {
    fetch(`/api/events/${id}`).then(r => r.json()).then(data => {
      // Local time formatting for datetime-local input
      if (data.date) {
        const d = new Date(data.date);
        const tzOffset = d.getTimezoneOffset() * 60000; 
        const localISOTime = (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 16);
        data.date = localISOTime;
      }
      setInitialData(data);
      setSelectedTenant(data.tenantId);
    });
    fetch('/api/tenants').then(r => r.json()).then(setTenants);
  }, [id]);

  useEffect(() => {
    if (!selectedTenant) return;
    fetch(`/api/spaces?tenantId=${selectedTenant}`).then(r => r.json()).then(data => {
      setSpaces(Array.isArray(data) ? data : []);
    });
  }, [selectedTenant]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      date: formData.get("date"),
      price: formData.get("price") || "FREE",
      tenantId: formData.get("tenantId"),
      spaceId: formData.get("spaceId"),
    };

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error actualizando");
      }
      router.push("/admin/events");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!initialData) return <div className="p-8 text-center text-on-surface-variant">Cargando datos...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Editar Evento</h1>
        <p className="text-on-surface-variant text-body-md">Modifica horarios y detalles.</p>
      </div>

      <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm p-8">
        {errorMsg && (
          <div className="mb-6 p-4 bg-error/10 border border-error text-error rounded-xl">
            <strong>Atención:</strong> {errorMsg}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Título del Evento</label>
            <input name="title" defaultValue={initialData.title} required type="text" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" />
          </div>
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Fecha y Hora</label>
            <input name="date" defaultValue={initialData.date} required type="datetime-local" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-title-sm text-university-blue mb-2">Facultad</label>
              <select 
                name="tenantId" 
                required 
                value={selectedTenant}
                onChange={e => setSelectedTenant(e.target.value)}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest"
              >
                {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-title-sm text-university-blue mb-2">Espacio Físico</label>
              <select name="spaceId" defaultValue={initialData.spaceId} required disabled={!selectedTenant || spaces.length === 0} className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest">
                {spaces.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Descripción</label>
            <textarea name="description" defaultValue={initialData.description || ""} rows={3} className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" />
          </div>
          
          <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant/50">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={loading}>{loading ? "Validando..." : "Actualizar Evento"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
