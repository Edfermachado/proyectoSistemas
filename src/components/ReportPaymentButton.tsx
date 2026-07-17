"use client";

import { useState } from "react";
import { ReportPaymentModal } from "./ReportPaymentModal";

interface ReportPaymentButtonProps {
  attendeeId: string;
  eventTitle: string;
  paymentBank: string | null;
  paymentPhone: string | null;
  paymentId: string | null;
}

export function ReportPaymentButton(props: ReportPaymentButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-academic-gold/10 hover:bg-academic-gold/20 text-academic-gold px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-[18px]">payments</span>
        Reportar Pago
      </button>
      
      {isOpen && (
        <ReportPaymentModal 
          {...props} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </>
  );
}
