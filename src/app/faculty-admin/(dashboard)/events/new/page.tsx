"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { EventTimePicker } from "@/components/EventTimePicker";

export default function FacultyNewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isFree, setIsFree] = useState(false);
  
  // We need to fetch the admin's faculty and its available spaces
  const [faculty, setFaculty] = useState<{id: string, name: string} | null>(null);
  const [spaces, setSpaces] = useState<{id: string, name: string, capacity: number}[]>([]);
  const [managers, setManagers] = useState<{id: string, email: string}[]>([]);

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
      
    // Fetch managers for this tenant
    fetch(`/api/users/managers?role=event_manager`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setManagers(data);
      })
      .catch(() => setManagers([]));
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
    let priceVal = formData.get("price") as string;
    
    // Validaciones extra
    const duration = parseInt(formData.get("duration") as string, 10);
    if (isNaN(duration) || duration <= 0 || duration > 1440) {
      setErrorMsg("La duración del evento debe estar entre 1 minuto y 24 horas.");
      setLoading(false);
      return;
    }

    const date = new Date(formData.get("date") as string);
    const now = new Date();
    // Allow up to 10 minutes in the past just to account for slow typing, but not significantly in the past
    if (date.getTime() < now.getTime() - 10 * 60000) {
      setErrorMsg("La fecha de inicio del evento no puede ser en el pasado.");
      setLoading(false);
      return;
    }

    const capacityStr = formData.get("capacity") as string;
    if (capacityStr) {
      const capacity = parseInt(capacityStr, 10);
      if (isNaN(capacity) || capacity <= 0 || capacity > 100000) {
        setErrorMsg("La capacidad debe ser un número válido mayor a 0.");
        setLoading(false);
        return;
      }
    }

    if (isFree || !priceVal || priceVal.toUpperCase() === "FREE" || priceVal.toUpperCase() === "GRATIS") {
      formData.set("price", "0");
    } else {
      formData.set("price", priceVal.replace(",", "."));
    }

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
          
          <EventTimePicker />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-title-sm text-university-blue">Precio de Entrada</label>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isFree" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} className="w-4 h-4 accent-university-blue cursor-pointer" />
                  <label htmlFor="isFree" className="text-xs font-bold text-university-blue cursor-pointer">Es Gratis</label>
                </div>
              </div>
              <input name="price" type="text" disabled={isFree} value={isFree ? "GRATIS" : undefined} className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest disabled:opacity-50 disabled:bg-surface-container" placeholder="0 para gratis, o 10.50" defaultValue="0" />
            </div>
            <div>
              <label className="block font-title-sm text-university-blue mb-2">Capacidad Especial (Opcional)</label>
              <input name="capacity" type="number" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="Ej. 150 (ignora límite del espacio)" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-title-sm text-university-blue mb-2">Visibilidad</label>
              <select name="visibility" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest">
                <option value="publico">Público</option>
                <option value="privado">Privado</option>
              </select>
            </div>
            <div className="flex items-center gap-3 mt-8">
              <input type="checkbox" name="requiresIpProtection" id="requiresIpProtection" value="true" className="w-5 h-5 accent-university-blue cursor-pointer" />
              <label htmlFor="requiresIpProtection" className="font-title-sm text-university-blue cursor-pointer">Requiere Protección Intelectual (IP)</label>
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
          
          {!isFree && (
            <div className="pt-4 border-t border-outline-variant/50">
              <h3 className="font-title-lg text-university-blue mb-4">Datos de Pago Móvil & Encargado</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block font-title-sm text-university-blue mb-2">Encargado del Evento</label>
                  <select name="managerId" required={!isFree} className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest">
                    <option value="">-- Selecciona un Encargado --</option>
                    {managers.map(m => <option key={m.id} value={m.id}>{m.email}</option>)}
                  </select>
                  <p className="text-xs text-on-surface-variant mt-1">Será responsable de validar los pagos.</p>
                </div>
                <div>
                  <label className="block font-title-sm text-university-blue mb-2">Banco</label>
                  <select name="paymentBank" required={!isFree} className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest">
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
                  <input name="paymentPhone" required={!isFree} type="text" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="Ej. 0414-1234567" />
                </div>
                <div>
                  <label className="block font-title-sm text-university-blue mb-2">Cédula / RIF</label>
                  <input name="paymentId" required={!isFree} type="text" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="Ej. V-12345678 o J-123456789" />
                </div>
              </div>
            </div>
          )}
          
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
