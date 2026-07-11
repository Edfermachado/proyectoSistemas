"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function FacultyNewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // We need to fetch the admin's faculty and its available spaces
  const [faculty, setFaculty] = useState<{id: string, name: string} | null>(null);
  const [spaces, setSpaces] = useState<{id: string, name: string, capacity: number}[]>([]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data && data.id) {
          setFaculty(data);
        }
      });
  }, []);

  useEffect(() => {
    if (!faculty) return;
    
    fetch(`/api/spaces?tenantId=${faculty.id}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setSpaces(data);
      })
      .catch(() => setSpaces([]));
  }, [faculty]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!faculty) {
      setErrorMsg("No tienes una facultad asignada");
      return;
    }
    
    setLoading(true);
    setErrorMsg("");
    
    const formData = new FormData(e.currentTarget);
    formData.append("tenantId", faculty.id); // Agregamos la facultad asignada
    if (!formData.get("price")) formData.set("price", "FREE");

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        body: formData,
        // No se establece "Content-Type", el navegador se encarga de enviarlo como multipart/form-data
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error creando evento");
      }
      
      router.push("/faculty-admin/events");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Crear Nuevo Evento</h1>
        <p className="text-on-surface-variant text-body-md">
          Estás creando un evento para <span className="font-bold text-academic-gold">{faculty ? faculty.name : "..."}</span>
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
            <label className="block font-title-sm text-university-blue mb-2">Título del Evento</label>
            <input name="title" required type="text" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="Ej. Taller de Diseño" />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-title-sm text-university-blue mb-2">Fecha y Hora</label>
              <input name="date" required type="datetime-local" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" />
            </div>
            <div>
              <label className="block font-title-sm text-university-blue mb-2">Duración (min)</label>
              <input name="duration" required type="number" min="15" step="15" defaultValue="60" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" />
            </div>
            <div>
              <label className="block font-title-sm text-university-blue mb-2">Precio de Entrada</label>
              <input name="price" type="text" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="FREE, $10, etc." defaultValue="FREE" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-title-sm text-university-blue mb-2">Espacio Físico</label>
              <select name="spaceId" required disabled={spaces.length === 0} className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest disabled:opacity-50">
                <option value="">{spaces.length === 0 ? "-- Sin Espacios --" : "-- Selecciona un Espacio --"}</option>
                {spaces.map(s => <option key={s.id} value={s.id}>{s.name} (Capacidad: {s.capacity})</option>)}
              </select>
            </div>
            <div>
              <label className="block font-title-sm text-university-blue mb-2">Foto / Banner (Opcional)</label>
              <input name="image" type="file" accept="image/jpeg, image/png, image/webp" className="w-full px-4 py-2 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-university-blue file:text-white hover:file:bg-innovation-purple cursor-pointer text-sm" />
              <p className="text-xs text-on-surface-variant mt-1">Máximo 5MB (JPG, PNG, WEBP)</p>
            </div>
          </div>
          
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Descripción (Opcional)</label>
            <textarea name="description" rows={4} className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="Detalles del evento..." />
          </div>
          
          <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant/50">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={loading || !faculty}>{loading ? "Guardando..." : "Publicar Evento"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
