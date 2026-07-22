"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function CleanupDatabasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [targetType, setTargetType] = useState<"all" | "events" | "attendees" | "seed">("all");

  const handleCleanup = async () => {
    if (confirmText !== "LIMPIAR") {
      setMessage("Debes escribir LIMPIAR para confirmar.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/cleanup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: targetType })
      });

      if (!res.ok) {
        throw new Error("Error al limpiar la base de datos.");
      }

      setMessage("Limpieza ejecutada exitosamente.");
      setConfirmText("");
    } catch (e: any) {
      setMessage(e.message || "Error desconocido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Mantenimiento de Base de Datos</h1>
        <p className="text-on-surface-variant text-body-md">
          Herramienta de limpieza manual. Útil para eliminar datos de prueba garantizando el orden correcto de llaves foráneas.
        </p>
      </div>

      <div className="bg-surface-white rounded-3xl border border-error/20 shadow-sm p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-error"></div>
        
        <h2 className="font-title-lg text-error mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined">warning</span>
          Zona de Peligro
        </h2>
        
        <p className="text-on-surface-variant text-sm mb-6">
          Esta acción no se puede deshacer. Por favor, selecciona cuidadosamente qué tipo de datos deseas limpiar. 
          El sistema se encargará de eliminar los registros respetando la jerarquía para evitar errores de restricción de clave foránea.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Selecciona qué limpiar:</label>
            <select 
              value={targetType}
              onChange={(e) => setTargetType(e.target.value as any)}
              className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-error bg-surface-container-lowest"
            >
              <option value="attendees">Solo Asistentes y Logs (Mantener Eventos)</option>
              <option value="events">Eventos, Asistentes y Solicitudes</option>
              <option value="all">Limpieza Parcial (Borra todo, excepto Universidades, Categorías y Facultades)</option>
              <option value="seed">Limpieza Total / Seed (Borra TODO en la BD excepto superadmin)</option>
            </select>
          </div>

          <div>
            <label className="block font-title-sm text-university-blue mb-2">
              Escribe <strong className="text-error">LIMPIAR</strong> para confirmar
            </label>
            <input 
              type="text" 
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="LIMPIAR"
              className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-error bg-surface-container-lowest" 
            />
          </div>

          {message && (
            <div className={`p-4 rounded-xl text-sm font-bold ${message.includes("exitosa") ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}>
              {message}
            </div>
          )}

          <div className="pt-4 border-t border-outline-variant/50 flex justify-end">
            <button 
              onClick={handleCleanup}
              disabled={loading || confirmText !== "LIMPIAR"}
              className="px-6 py-3 bg-error text-white font-bold rounded-xl hover:bg-error/90 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined">delete_forever</span>
              {loading ? "Procesando..." : "Ejecutar Limpieza"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
