"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      icon: formData.get("icon") || null,
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
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Nombre de la Categoría</label>
            <input name="name" required type="text" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="Ej. Ingeniería" />
          </div>
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Icono (Material Symbols, Opcional)</label>
            <input name="icon" type="text" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="Ej. engineering" />
            <p className="text-xs text-on-surface-variant mt-1">Ingresa el identificador de un icono de Material Symbols (e.g. science, palette).</p>
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
