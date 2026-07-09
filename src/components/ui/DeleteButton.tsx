"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteButton({ endpoint, id }: { endpoint: string; id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar este registro? Esta acción no se puede deshacer.")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/${endpoint}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error eliminando registro");
      }
      router.refresh();
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Error eliminando el registro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={loading}
      title="Eliminar"
      className={`p-2 ml-2 transition-colors ${loading ? "text-on-surface-variant/50" : "text-error hover:text-error/80"}`}
    >
      <span className="material-symbols-outlined text-sm">{loading ? "hourglass_empty" : "delete"}</span>
    </button>
  );
}
