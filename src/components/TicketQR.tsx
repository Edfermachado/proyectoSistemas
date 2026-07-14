"use client";

import { QRCodeSVG } from "qrcode.react";

interface TicketQRProps {
  token: string;
}

export default function TicketQR({ token }: TicketQRProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-surface-white rounded-3xl shadow-xl border border-outline-variant max-w-sm mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-academic-gold"></div>
      
      <div className="bg-white p-4 rounded-2xl shadow-inner border border-surface-container-high mb-6 relative">
        <QRCodeSVG 
          value={token} 
          size={240} 
          level="H" 
          includeMargin={false} 
          fgColor="#1A365D" /* university-blue */
        />
        {/* Corner decorative brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-academic-gold"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-academic-gold"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-academic-gold"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-academic-gold"></div>
      </div>
      <p className="font-headline-sm text-lg font-bold text-university-blue tracking-wider uppercase mb-2">Entrada Válida</p>
      <p className="text-xs text-on-surface-variant font-mono text-center break-all max-w-[200px]">{token}</p>
    </div>
  );
}
