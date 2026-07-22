"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { EventTimePicker } from "@/components/EventTimePicker";

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [tenants, setTenants] = useState<{id: string, name: string}[]>([]);
  const [spaces, setSpaces] = useState<{id: string, name: string, tenantId: string}[]>([]);
  const [managers, setManagers] = useState<{id: string, email: string}[]>([]);
  const [selectedTenant, setSelectedTenant] = useState("");

  useEffect(() => {
    fetch('/api/tenants').then(r => r.json()).then(setTenants);
  }, []);

  useEffect(() => {
    if (!selectedTenant) {
      return;
    }
    fetch(`/api/spaces?tenantId=${selectedTenant}`)
      .then(r => r.json())
      .then(data => {
        // As the API might return an error object if something goes wrong, we verify it's an array
        if (Array.isArray(data)) setSpaces(data);
        else setSpaces([]);
      })
      .catch(() => setSpaces([]));

    fetch(`/api/users/managers?role=event_manager&tenantId=${selectedTenant}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setManagers(data);
        else setManagers([]);
      })
      .catch(() => setManagers([]));
  }, [selectedTenant]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    
    const formData = new FormData(e.currentTarget);
    if (!formData.get("price")) formData.set("price", "FREE");

    // Validaciones extra
    const duration = parseInt(formData.get("duration") as string, 10);
    if (isNaN(duration) || duration <= 0 || duration > 1440) {
      setErrorMsg("La duración del evento debe estar entre 1 minuto y 24 horas.");
      setLoading(false);
      return;
    }

    const date = new Date(formData.get("date") as string);
    const now = new Date();
    if (date.getTime() < now.getTime() - 10 * 60000) {
      setErrorMsg("La fecha de inicio del evento no puede ser en el pasado.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error creando evento");
      }
      
      router.push("/admin/events");
      router.refresh();
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Error desconocido");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Programar Evento</h1>
        <p className="text-on-surface-variant text-body-md">Registra una nueva actividad. Se validarán colisiones de horario automáticamente.</p>
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
            <input name="title" required type="text" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="Ej. Taller de Robótica" />
          </div>
          
          <EventTimePicker />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-title-sm text-university-blue mb-2">Facultad</label>
              <select 
                name="tenantId" 
                required 
                value={selectedTenant}
                onChange={e => {
                  setSelectedTenant(e.target.value);
                  setSpaces([]);
                  setManagers([]);
                }}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest"
              >
                <option value="">-- Seleccionar --</option>
                {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-title-sm text-university-blue mb-2">Espacio Físico</label>
              <select name="spaceId" required disabled={!selectedTenant || spaces.length === 0} className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest disabled:opacity-50">
                <option value="">{spaces.length === 0 && selectedTenant ? "-- Sin Espacios --" : "-- Seleccionar --"}</option>
                {spaces.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-title-sm text-university-blue mb-2">Encargado del Evento</label>
              <select name="managerId" required disabled={!selectedTenant || managers.length === 0} className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest disabled:opacity-50">
                <option value="">{managers.length === 0 && selectedTenant ? "-- Sin Gestores --" : "-- Seleccionar --"}</option>
                {managers.map(m => <option key={m.id} value={m.id}>{m.email}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-title-sm text-university-blue mb-2">Foto / Banner (Opcional)</label>
            <input name="image" type="file" accept="image/jpeg, image/png, image/webp" className="w-full px-4 py-2 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-university-blue file:text-white hover:file:bg-innovation-purple cursor-pointer text-sm" />
            <p className="text-xs text-on-surface-variant mt-1">Máximo 5MB (JPG, PNG, WEBP)</p>
          </div>
          
          
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Descripción (Opcional)</label>
            <textarea name="description" rows={3} className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" />
          </div>
          
          <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant/50">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={loading}>{loading ? "Validando..." : "Crear Evento"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
