"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

export function ConfirmPaymentButton({ attendeeId, eventId, hasReport }: { attendeeId: string; eventId: string; hasReport?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  async function handleVerify(action: 'approve' | 'reject') {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attendeeId, action })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al verificar");
      }
      
      if (action === 'approve') setDone(true);
      router.refresh();
    } catch (err: unknown) {
      setErrorMsg((err instanceof Error ? err.message : "Error desconocido"));
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <span className="inline-flex items-center gap-1 text-green-600 font-bold text-sm">
        <span className="material-symbols-outlined text-sm">check_circle</span>
        Pagado
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {errorMsg && <span className="text-xs text-error">{errorMsg}</span>}
      <div className="flex gap-2">
        <button
          onClick={() => handleVerify('approve')}
          disabled={loading}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 border border-green-300 rounded-lg text-sm font-bold hover:bg-green-200 transition-colors disabled:opacity-50"
          title="Aprobar Pago"
        >
          {loading ? (
            <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
          ) : (
            <span className="material-symbols-outlined text-sm">check</span>
          )}
          Aprobar
        </button>
        {hasReport && (
          <button
            onClick={() => handleVerify('reject')}
            disabled={loading}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-error/10 text-error border border-error/30 rounded-lg text-sm font-bold hover:bg-error/20 transition-colors disabled:opacity-50"
            title="Rechazar Pago"
          >
            {loading ? (
              <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-sm">close</span>
            )}
            Rechazar
          </button>
        )}
      </div>
    </div>
  );
}
