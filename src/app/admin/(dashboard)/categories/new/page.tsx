"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

const ICONS_LIST = [
  "engineering", "science", "palette", "medical_services", 
  "history_edu", "sports_basketball", "account_balance", "language",
  "biotech", "gavel", "architecture", "psychology",
  "public", "music_note", "restaurant", "local_library"
];

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string>("category");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      icon: selectedIcon,
    };

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error("Error creating category");
      router.push("/admin/categories");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error creando la categoría");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Nueva Categoría</h1>
        <p className="text-on-surface-variant text-body-md">Registra una nueva categoría para agrupar facultades.</p>
      </div>

      <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm p-8">
        <form onSubmit={onSubmit} className="space-y-8">
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Nombre de la Categoría</label>
            <input name="name" required type="text" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="Ej. Ingeniería" />
          </div>
          
          <div>
            <label className="block font-title-sm text-university-blue mb-4">Icono Representativo</label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
              {ICONS_LIST.map((icon) => (
                <button
                  type="button"
                  key={icon}
                  onClick={() => setSelectedIcon(icon)}
                  className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
                    selectedIcon === icon 
                      ? "bg-university-blue text-white shadow-md scale-110" 
                      : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/50 hover:border-university-blue/50"
                  }`}
                  title={icon}
                >
                  <span className="material-symbols-outlined">{icon}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-on-surface-variant mt-3 italic">
              Selecciona el icono que mejor represente visualmente a esta categoría.
            </p>
          </div>
          
          <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant/50">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={loading}>{loading ? "Guardando..." : "Guardar Categoría"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
