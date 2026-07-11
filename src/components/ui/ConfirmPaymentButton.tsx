"use client";

import { useState } from "react";
import { confirmPayment } from "@/app/actions/attendees.actions";

export function ConfirmPaymentButton({ attendeeId, eventId }: { attendeeId: string; eventId: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    const res = await confirmPayment(attendeeId, eventId);
    if (res.success) setDone(true);
    setLoading(false);
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
    <button
      onClick={handleConfirm}
      disabled={loading}
      className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 border border-green-300 rounded-lg text-sm font-bold hover:bg-green-200 transition-colors disabled:opacity-50"
    >
      {loading ? (
        <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
      ) : (
        <span className="material-symbols-outlined text-sm">payments</span>
      )}
      Confirmar Pago
    </button>
  );
}
