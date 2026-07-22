"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function NewUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tenants, setTenants] = useState<{id: string, name: string}[]>([]);
  const [activeTab, setActiveTab] = useState<"superadmin" | "tenant_admin">("superadmin");

  useEffect(() => {
    fetch('/api/tenants').then(r => r.json()).then(setTenants);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data: any = {
      email: formData.get("email"),
      passwordHash: formData.get("password"),
      role: activeTab,
    };

    if (activeTab === "tenant_admin") {
      data.tenantId = formData.get("tenantId");
      data.name = formData.get("name");
      data.lastName = formData.get("lastName");
      data.documentId = formData.get("documentId");
      data.phone = formData.get("phone");
    } else {
      data.tenantId = null;
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error("Error creating user");
      router.push("/admin/users");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error creando el usuario");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Nuevo Administrador</h1>
        <p className="text-on-surface-variant text-body-md">Crea una cuenta con su nivel de acceso respectivo.</p>
      </div>

      <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm p-8">
        
        {/* Tabs */}
        <div className="flex bg-surface-container-lowest rounded-xl p-1 mb-8 shadow-sm border border-outline-variant/30">
          <button
            type="button"
            onClick={() => setActiveTab("superadmin")}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
              activeTab === "superadmin" 
                ? "bg-university-blue text-white shadow-md" 
                : "text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            Superadministrador Global
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tenant_admin")}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
              activeTab === "tenant_admin" 
                ? "bg-academic-gold text-university-blue shadow-md" 
                : "text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            Administrador de Facultad
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="mb-6">
            <h2 className="font-headline-md text-2xl text-university-blue mb-2 font-bold">
              {activeTab === "superadmin" ? "Crear Superadministrador" : "Crear Administrador de Facultad"}
            </h2>
            <p className="font-body-md text-sm text-slate-500">
              {activeTab === "superadmin" 
                ? "Tendrá acceso global a todas las universidades y configuraciones del sistema." 
                : "Estará asignado a una facultad específica y gestionará sus propios eventos y gestores."}
            </p>
          </div>

          <div>
            <label className="block font-title-sm text-university-blue mb-2">Correo Electrónico</label>
            <input name="email" required type="email" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder={activeTab === "superadmin" ? "superadmin@unievents.com" : "admin@facultad.edu"} />
          </div>
          
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Contraseña</label>
            <input name="password" required type="password" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" />
          </div>

          {activeTab === "tenant_admin" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-title-sm text-university-blue mb-2">Nombre</label>
                  <input name="name" required type="text" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="Ej. Carlos" />
                </div>
                <div>
                  <label className="block font-title-sm text-university-blue mb-2">Apellido</label>
                  <input name="lastName" required type="text" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="Ej. Mendoza" />
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
                <label className="block font-title-sm text-university-blue mb-2">Asignar Facultad</label>
                <select name="tenantId" required className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest">
                  <option value="">-- Selecciona una Facultad --</option>
                  {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </>
          )}

          <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant/50">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={loading}>{loading ? "Guardando..." : "Crear Usuario"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
