"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [tenants, setTenants] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    fetch(`/api/users/${id}`).then(r => r.json()).then(setInitialData);
    fetch('/api/tenants').then(r => r.json()).then(setTenants);
  }, [id]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const password = formData.get("password") as string;
    const data: any = {
      email: formData.get("email"),
      role: formData.get("role"),
      tenantId: formData.get("tenantId") || null,
    };
    if (password) data.passwordHash = password;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error("Error");
      router.push("/admin/users");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error actualizando usuario");
    } finally {
      setLoading(false);
    }
  }

  if (!initialData) return <div className="p-8 text-center text-on-surface-variant">Cargando datos...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Editar Administrador</h1>
        <p className="text-on-surface-variant text-body-md">Actualiza permisos y acceso.</p>
      </div>

      <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm p-8">
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Correo Electrónico</label>
            <input name="email" defaultValue={initialData.email} required type="email" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" />
          </div>
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Contraseña (Dejar en blanco para no cambiar)</label>
            <input name="password" type="password" placeholder="••••••••" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" />
          </div>
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Rol</label>
            <select name="role" defaultValue={initialData.role} required className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest">
              <option value="user">Usuario Regular</option>
              <option value="tenant_admin">Admin de Facultad</option>
              <option value="superadmin">Superadministrador Global</option>
            </select>
          </div>
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Facultad</label>
            <select name="tenantId" defaultValue={initialData.tenantId || ""} className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest">
              <option value="">-- Sin Facultad (Global) --</option>
              {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant/50">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={loading}>{loading ? "Guardando..." : "Actualizar Usuario"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
