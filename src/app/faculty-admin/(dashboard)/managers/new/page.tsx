"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function NewManagerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email"),
      passwordHash: formData.get("password"),
      role: "event_manager",
      name: formData.get("name"),
      lastName: formData.get("lastName"),
      documentId: formData.get("documentId"),
      phone: formData.get("phone"),
      // but the API `POST /api/users` requires tenantId if not superadmin.
      // Alternatively, we can let the API extract tenantId from session.
      // Wait, let's create a dedicated action or endpoint if `POST /api/users` doesn't handle it well.
      // Let's use `POST /api/users/managers` for safety or just pass tenantId.
      // But we are client-side. We can fetch `/api/users` and pass `isManager: true`.
    };

    try {
      const res = await fetch("/api/users/managers", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error("Error creating manager");
      router.push("/faculty-admin/managers");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error creando el gestor. Asegúrate de que el correo no esté en uso.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Nuevo Gestor de Eventos</h1>
        <p className="text-on-surface-variant text-body-md">Crea una cuenta para un organizador de eventos en tu facultad.</p>
      </div>

      <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm p-8">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-title-sm text-university-blue mb-2">Nombre</label>
              <input name="name" required type="text" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="Ej. Juan" />
            </div>
            <div>
              <label className="block font-title-sm text-university-blue mb-2">Apellido</label>
              <input name="lastName" required type="text" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="Ej. Pérez" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-title-sm text-university-blue mb-2">Cédula de Identidad</label>
              <input name="documentId" required type="text" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="Ej. V-12345678" />
            </div>
            <div>
              <label className="block font-title-sm text-university-blue mb-2">Teléfono</label>
              <input name="phone" required type="text" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="Ej. 0414-1234567" />
            </div>
          </div>

          <div>
            <label className="block font-title-sm text-university-blue mb-2">Correo Electrónico</label>
            <input name="email" required type="email" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="gestor@facultad.edu" />
          </div>
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Contraseña Temporal</label>
            <input name="password" required type="password" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="********" />
          </div>
          
          <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant/50">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={loading}>{loading ? "Creando..." : "Crear Gestor"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
