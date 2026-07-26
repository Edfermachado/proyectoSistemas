'use client';

import { useState } from 'react';
import { approveEventAction, rejectEventAction } from '@/app/actions/approvals.actions';

export function ApprovalButtons({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!confirm('¿Estás seguro de que deseas APROBAR este evento propuesto por el departamento?')) return;
    setLoading(true);
    try {
      await approveEventAction(eventId);
    } catch (err: any) {
      alert(err.message || 'Error al aprobar el evento');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirm('¿Estás seguro de que deseas RECHAZAR este evento propuesto?')) return;
    setLoading(true);
    try {
      await rejectEventAction(eventId);
    } catch (err: any) {
      alert(err.message || 'Error al rechazar el evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleApprove}
        disabled={loading}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-2 rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center gap-1"
      >
        <span>✓</span> Aprobar
      </button>
      <button
        onClick={handleReject}
        disabled={loading}
        className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3 py-2 rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center gap-1"
      >
        <span>✕</span> Rechazar
      </button>
    </div>
  );
}
