"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { DeleteButton } from "@/components/ui/DeleteButton";

export default function EditTenantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [universities, setUniversities] = useState<{id: string, name: string}[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  
  // States for admins
  const [admins, setAdmins] = useState<any[]>([]);
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  useEffect(() => {
    fetch(`/api/tenants/${id}`).then(r => r.json()).then(setInitialData);
    fetch('/api/universities').then(r => r.json()).then(setUniversities);
    fetch('/api/categories').then(r => r.json()).then(setCategories);
    fetchAdmins();
  }, [id]);

  function fetchAdmins() {
    fetch(`/api/users?tenantId=${id}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setAdmins(data);
      });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      universityId: formData.get("universityId") || null,
      categoryId: formData.get("categoryId") || null,
    };

    try {
      const res = await fetch(`/api/tenants/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error("Error");
      router.push("/admin/tenants");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error actualizando la facultad");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAdmin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setCreatingAdmin(true);
    const formData = new FormData(form);
    const data = {
      email: formData.get("email"),
      passwordHash: formData.get("password"), // Contraseña plana en el prototipo
      role: "tenant_admin",
      tenantId: id,
    };

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error("Error creando admin");
      
      // Clear form and reload admins
      form.reset();
      fetchAdmins();
    } catch (error) {
      console.error(error);
      alert("Error creando administrador");
    } finally {
      setCreatingAdmin(false);
    }
  }

  if (!initialData) return <div className="p-8 text-center text-on-surface-variant">Cargando datos...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="font-headline-lg text-university-blue mb-2 text-3xl">Editar Facultad</h1>
        <p className="text-on-surface-variant text-body-md">Modifica los detalles de la organización.</p>
      </div>

      <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm p-8">
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Nombre de la Facultad</label>
            <input name="name" defaultValue={initialData.name} required type="text" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" />
          </div>
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Descripción</label>
            <textarea name="description" defaultValue={initialData.description || ""} rows={4} className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" />
          </div>
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Universidad</label>
            <select name="universityId" defaultValue={initialData.universityId || ""} className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest">
              <option value="">-- Sin Universidad / Independiente --</option>
              {universities.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-title-sm text-university-blue mb-2">Categoría (Opcional)</label>
            <select name="categoryId" defaultValue={initialData.categoryId || ""} className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest">
              <option value="">-- Sin Categoría --</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant/50">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={loading}>{loading ? "Guardando..." : "Actualizar Facultad"}</Button>
          </div>
        </form>
      </div>

      {/* Admin Management Section */}
      <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm p-8">
        <h2 className="font-headline-lg text-university-blue mb-6 text-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-academic-gold">shield_person</span>
          Administradores de Facultad
        </h2>
        
        <div className="mb-8">
          {admins.length === 0 ? (
            <p className="text-on-surface-variant text-sm italic">No hay administradores asignados a esta facultad.</p>
          ) : (
            <ul className="space-y-3">
              {admins.map(admin => (
                <li key={admin.id} className="flex justify-between items-center bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/50">
                  <div>
                    <p className="font-bold text-university-blue">{admin.email}</p>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest">{admin.role}</p>
                  </div>
                  <DeleteButton endpoint="users" id={admin.id} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={handleCreateAdmin} className="space-y-4 border-t border-outline-variant/50 pt-6">
          <h3 className="font-title-sm text-university-blue mb-2">Asignar nuevo administrador</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="email" required type="email" placeholder="Correo electrónico" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" />
            <input name="password" required type="password" placeholder="Contraseña" className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" />
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="primary" icon="add" disabled={creatingAdmin}>
              {creatingAdmin ? "Creando..." : "Crear Administrador"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
