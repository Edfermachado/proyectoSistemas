"use client";

import { useState } from "react";
import { manualRegisterByAdmin } from "@/app/actions/attendees.actions";

export function ManualRegisterForm({ eventId }: { eventId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const res = await manualRegisterByAdmin(formData);
    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => { setSuccess(false); setOpen(false); }, 1500);
    } else {
      setError(res.error || "Error al registrar");
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-academic-gold text-university-blue px-5 py-2.5 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md text-sm"
      >
        <span className="material-symbols-outlined text-sm">person_add</span>
        Registrar Asistente
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-sm text-university-blue">Registrar Asistente</h3>
              <button onClick={() => setOpen(false)} className="material-symbols-outlined text-outline hover:text-university-blue">close</button>
            </div>

            {success ? (
              <div className="py-8 text-center">
                <span className="material-symbols-outlined text-5xl text-green-500">check_circle</span>
                <p className="font-bold text-green-600 mt-4">¡Asistente registrado!</p>
              </div>
            ) : (
              <form action={handleSubmit} className="space-y-4">
                <input type="hidden" name="eventId" value={eventId} />
                <input type="hidden" name="status" value="confirmed" />

                <div>
                  <label className="block text-sm font-bold text-university-blue mb-1">Nombre Completo</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">person</span>
                    <input type="text" name="name" required
                      className="w-full pl-10 pr-4 py-2.5 border border-outline-variant rounded-xl focus:border-academic-gold focus:ring-1 focus:ring-academic-gold outline-none text-sm"
                      placeholder="Juan Pérez" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-university-blue mb-1">Correo Electrónico</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">mail</span>
                    <input type="email" name="email" required
                      className="w-full pl-10 pr-4 py-2.5 border border-outline-variant rounded-xl focus:border-academic-gold focus:ring-1 focus:ring-academic-gold outline-none text-sm"
                      placeholder="juan@universidad.edu" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-university-blue mb-1">Teléfono</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">phone</span>
                    <input type="tel" name="phone" required
                      className="w-full pl-10 pr-4 py-2.5 border border-outline-variant rounded-xl focus:border-academic-gold focus:ring-1 focus:ring-academic-gold outline-none text-sm"
                      placeholder="+58 412 1234567" />
                  </div>
                </div>

                {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setOpen(false)}
                    className="flex-1 border border-outline-variant text-on-surface-variant py-2.5 rounded-xl font-bold text-sm hover:bg-surface-container-low transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 bg-university-blue text-white py-2.5 rounded-xl font-bold text-sm hover:bg-innovation-purple transition-colors disabled:opacity-50 flex items-center justify-center gap-1">
                    {loading ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span> : <span className="material-symbols-outlined text-sm">check</span>}
                    Confirmar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
