"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { EventTimePicker } from "@/components/EventTimePicker";

export default function FacultyEditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [faculty, setFaculty] = useState<{id: string, name: string} | null>(null);
  const [spaces, setSpaces] = useState<{id: string, name: string, capacity: number}[]>([]);
  const [managers, setManagers] = useState<{id: string, email: string}[]>([]);
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
      
    fetch(`/api/users/managers?role=event_manager`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setManagers(data);
      })
      .catch(() => setManagers([]));
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
          
          <EventTimePicker initialDate={formattedDate} initialDuration={eventData.duration} />
          
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Precio de Entrada</label>
            <input name="price" defaultValue={eventData.price} type="text" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" />
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
          
          <div className="pt-4 border-t border-outline-variant/50">
            <h3 className="font-title-lg text-university-blue mb-4">Datos de Pago Móvil & Encargado</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-title-sm text-university-blue mb-2">Encargado del Evento</label>
                <select name="managerId" defaultValue={eventData.managerId || ""} required className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest">
                  <option value="">-- Selecciona un Encargado --</option>
                  {managers.map(m => <option key={m.id} value={m.id}>{m.email}</option>)}
                </select>
                <p className="text-xs text-on-surface-variant mt-1">Será responsable de validar los pagos.</p>
              </div>
              <div>
                <label className="block font-title-sm text-university-blue mb-2">Banco</label>
                <select name="paymentBank" defaultValue={eventData.paymentBank || ""} className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest">
                  <option value="">-- Selecciona Banco --</option>
                  <option value="0102 - Banco de Venezuela">0102 - Banco de Venezuela</option>
                  <option value="0104 - Banco Venezolano de Crédito">0104 - Banco Venezolano de Crédito</option>
                  <option value="0105 - Banco Mercantil">0105 - Banco Mercantil</option>
                  <option value="0108 - Banco Provincial">0108 - Banco Provincial</option>
                  <option value="0114 - Bancaribe">0114 - Bancaribe</option>
                  <option value="0115 - Banco Exterior">0115 - Banco Exterior</option>
                  <option value="0128 - Banco Caroní">0128 - Banco Caroní</option>
                  <option value="0134 - Banesco">0134 - Banesco</option>
                  <option value="0138 - Banco Plaza">0138 - Banco Plaza</option>
                  <option value="0151 - BFC Banco Fondo Común">0151 - BFC Banco Fondo Común</option>
                  <option value="0156 - 100% Banco">0156 - 100% Banco</option>
                  <option value="0157 - Banco del Sur">0157 - Banco del Sur</option>
                  <option value="0163 - Banco del Tesoro">0163 - Banco del Tesoro</option>
                  <option value="0168 - Bancrecer">0168 - Bancrecer</option>
                  <option value="0169 - Mi Banco">0169 - Mi Banco</option>
                  <option value="0171 - Banco Activo">0171 - Banco Activo</option>
                  <option value="0172 - Bancamiga">0172 - Bancamiga</option>
                  <option value="0174 - Banplus">0174 - Banplus</option>
                  <option value="0175 - Banco Bicentenario">0175 - Banco Bicentenario</option>
                  <option value="0177 - Banfanb">0177 - Banfanb</option>
                  <option value="0191 - BNC Nacional de Crédito">0191 - BNC Nacional de Crédito</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-title-sm text-university-blue mb-2">Teléfono de Pago Móvil</label>
                <input name="paymentPhone" defaultValue={eventData.paymentPhone || ""} type="text" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="Ej. 0414-1234567" />
              </div>
              <div>
                <label className="block font-title-sm text-university-blue mb-2">Cédula / RIF</label>
                <input name="paymentId" defaultValue={eventData.paymentId || ""} type="text" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="Ej. V-12345678 o J-123456789" />
              </div>
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
