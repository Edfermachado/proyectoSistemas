"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function FacultyEditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [faculty, setFaculty] = useState<{id: string, name: string} | null>(null);
  const [spaces, setSpaces] = useState<{id: string, name: string, capacity: number}[]>([]);
  const [eventData, setEventData] = useState<any>(null);

  // 1. Fetch faculty
  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data && data.id) {
          setFaculty(data);
        }
      });
  }, []);

  // 2. Fetch spaces when faculty is loaded
  useEffect(() => {
    if (!faculty) return;
    
    fetch(`/api/spaces?tenantId=${faculty.id}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setSpaces(data);
      })
      .catch(() => setSpaces([]));
  }, [faculty]);

  // 3. Fetch event data
  useEffect(() => {
    if (!id) return;
    
    fetch(`/api/events/${id}`)
      .then(r => r.json())
      .then(data => {
        setEventData(data);
      })
      .catch(() => setErrorMsg("No se pudo cargar el evento"));
  }, [id]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!faculty) return;
    
    setLoading(true);
    setErrorMsg("");
    
    const formData = new FormData(e.currentTarget);
    formData.append("tenantId", faculty.id);
    if (!formData.get("price")) formData.set("price", "FREE");

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "PUT",
        body: formData,
      });
      
      if (!res.ok) {
        // Fallback para APIs que no soportan PUT y en su lugar usan PATCH u otro
        // Si tienes problemas de API, ajusta el verbo o verifica /api/events/[id]
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Error actualizando evento");
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

  if (!eventData) return <div className="p-10 animate-pulse">Cargando...</div>;

  // Formato para datetime-local
  let formattedDate = "";
  if (eventData.date) {
    const d = new Date(eventData.date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    formattedDate = d.toISOString().slice(0, 16);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Editar Evento</h1>
        <p className="text-on-surface-variant text-body-md">
          Modifica los detalles del evento <span className="font-bold text-academic-gold">{eventData.title}</span>
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
            <input name="title" defaultValue={eventData.title} required type="text" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-title-sm text-university-blue mb-2">Fecha y Hora</label>
              <input name="date" defaultValue={formattedDate} required type="datetime-local" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" />
            </div>
            <div>
              <label className="block font-title-sm text-university-blue mb-2">Duración (min)</label>
              <input name="duration" defaultValue={eventData.duration || 60} required type="number" min="15" step="15" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" />
            </div>
            <div>
              <label className="block font-title-sm text-university-blue mb-2">Precio de Entrada</label>
              <input name="price" defaultValue={eventData.price} type="text" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-title-sm text-university-blue mb-2">Espacio Físico</label>
              <select name="spaceId" defaultValue={eventData.spaceId} required disabled={spaces.length === 0} className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest disabled:opacity-50">
                <option value="">{spaces.length === 0 ? "-- Sin Espacios --" : "-- Selecciona un Espacio --"}</option>
                {spaces.map(s => <option key={s.id} value={s.id}>{s.name} (Capacidad: {s.capacity})</option>)}
              </select>
            </div>
            <div>
              <label className="block font-title-sm text-university-blue mb-2">Foto / Banner (Opcional, dejar en blanco para mantener la actual)</label>
              <input name="image" type="file" accept="image/jpeg, image/png, image/webp" className="w-full px-4 py-2 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-university-blue file:text-white hover:file:bg-innovation-purple cursor-pointer text-sm" />
              <p className="text-xs text-on-surface-variant mt-1">Máximo 5MB (JPG, PNG, WEBP)</p>
              {eventData.imageUrl && (
                <div className="mt-2">
                  <p className="text-xs text-on-surface-variant mb-1">Imagen actual:</p>
                  <img src={eventData.imageUrl} alt="Current" className="w-32 h-auto rounded-lg border border-outline-variant" />
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Descripción</label>
            <textarea name="description" defaultValue={eventData.description || ""} rows={4} className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" />
          </div>
          
          <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant/50">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={loading || !faculty}>{loading ? "Guardando..." : "Guardar Cambios"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
