"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function NewUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tenants, setTenants] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    fetch('/api/tenants').then(r => r.json()).then(setTenants);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email"),
      passwordHash: formData.get("password"),
      role: formData.get("role"),
      tenantId: formData.get("tenantId") || null,
    };

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
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Correo Electrónico</label>
            <input name="email" required type="email" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="admin@universidad.edu" />
          </div>
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Contraseña</label>
            <input name="password" required type="password" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" />
          </div>
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Rol</label>
            <select name="role" required className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest">
              <option value="user">Usuario Regular</option>
              <option value="tenant_admin">Admin de Facultad</option>
              <option value="superadmin">Superadministrador Global</option>
            </select>
          </div>
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Facultad (Dejar vacío si es Global)</label>
            <select name="tenantId" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest">
              <option value="">-- Sin Facultad (Global) --</option>
              {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant/50">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={loading}>{loading ? "Guardando..." : "Crear Usuario"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
