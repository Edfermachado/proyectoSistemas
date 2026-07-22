"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";

interface ReportPaymentModalProps {
  attendeeId: string;
  eventTitle: string;
  paymentBank: string | null;
  paymentPhone: string | null;
  paymentId: string | null;
  onClose: () => void;
}

export function ReportPaymentModal({ attendeeId, eventTitle, paymentBank, paymentPhone, paymentId, onClose }: ReportPaymentModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    formData.append("attendeeId", attendeeId);

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al enviar el pago");
      }

      router.refresh();
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg((err instanceof Error ? err.message : "Error desconocido"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-white p-6 rounded-[2rem] shadow-2xl relative max-w-md w-full mx-auto">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 bg-surface-container-high rounded-full flex items-center justify-center text-on-surface-variant hover:text-error transition-colors">
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
        
        <h3 className="font-headline-md text-university-blue mb-2 text-2xl">Reportar Pago</h3>
        <p className="text-on-surface-variant text-sm mb-6">Para el evento: <strong className="text-academic-gold">{eventTitle}</strong></p>

        <div className="bg-university-blue/5 border border-university-blue/20 rounded-xl p-4 mb-6 text-sm">
          <p className="font-bold text-university-blue mb-2">Datos para Pago Móvil:</p>
          <ul className="space-y-1 text-on-surface">
            <li><strong>Banco:</strong> {paymentBank || "No especificado"}</li>
            <li><strong>Teléfono:</strong> {paymentPhone || "No especificado"}</li>
            <li><strong>Cédula/RIF:</strong> {paymentId || "No especificado"}</li>
          </ul>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-error/10 border border-error text-error rounded-xl text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block font-title-sm text-university-blue mb-1">Referencia (Últimos 4 dígitos)</label>
            <input name="paymentReference" required type="text" maxLength={4} pattern="\\d{4}" className="w-full px-4 py-2 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest" placeholder="Ej. 1234" />
          </div>
          
          <div>
            <label className="block font-title-sm text-university-blue mb-1">Capture de Pantalla (Opcional)</label>
            <input name="screenshot" type="file" accept="image/jpeg, image/png, image/webp" className="w-full px-4 py-2 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-academic-gold bg-surface-container-lowest file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-university-blue file:text-white hover:file:bg-innovation-purple cursor-pointer text-sm" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/50">
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={loading}>{loading ? "Enviando..." : "Enviar Reporte"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
