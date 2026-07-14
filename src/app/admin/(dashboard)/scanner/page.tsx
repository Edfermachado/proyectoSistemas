"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import Link from "next/link";

type ScanStatus = "idle" | "loading" | "success" | "duplicate" | "error";

export default function ScannerPage() {
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [message, setMessage] = useState("");
  const [details, setDetails] = useState<any>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Only initialize the scanner once
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner("reader", {
        qrbox: { width: 250, height: 250 },
        fps: 10,
        aspectRatio: 1.0
      }, false);
      
      scannerRef.current.render(
        async (decodedText) => {
          if (status === "loading") return;
          
          setStatus("loading");
          if (scannerRef.current) {
            scannerRef.current.pause(true); // Pause scanning
          }

          try {
            const res = await fetch('/api/tickets/validate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: decodedText })
            });

            const data = await res.json();
            
            if (res.status === 200) {
              setStatus("success");
              setMessage("ACCESO PERMITIDO");
              setDetails(data.attendee);
            } else if (res.status === 409) {
              setStatus("duplicate");
              setMessage("TICKET YA ESCANEADO");
              setDetails({ time: data.scannedAt });
            } else {
              setStatus("error");
              setMessage(data.error || "TICKET INVÁLIDO");
              setDetails(null);
            }
          } catch (err) {
            setStatus("error");
            setMessage("ERROR DE CONEXIÓN");
            setDetails(null);
          }

          // Resume after 3 seconds
          setTimeout(() => {
            setStatus("idle");
            setMessage("");
            setDetails(null);
            if (scannerRef.current) {
              scannerRef.current.resume();
            }
          }, 3500);
        },
        (error) => {
          // Ignore frequent scan errors
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex flex-col animate-fade-in">
      <div className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-university-blue">Escáner de Accesos</h1>
        <p className="text-on-surface-variant mt-2 font-body-md max-w-2xl">
          Verifica la autenticidad de las entradas escaneando el código QR. El sistema registrará la asistencia automáticamente.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-[500px] bg-surface-white rounded-3xl overflow-hidden shadow-xl border border-outline-variant relative">
          
          {/* Overlay Status */}
          {status !== "idle" && (
            <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center text-center p-8 transition-colors duration-300
              ${status === 'loading' ? 'bg-surface-white/90 backdrop-blur-sm' : ''}
              ${status === 'success' ? 'bg-green-500 text-white' : ''}
              ${status === 'duplicate' ? 'bg-academic-gold text-university-blue' : ''}
              ${status === 'error' ? 'bg-error text-white' : ''}
            `}>
              {status === 'loading' ? (
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-university-blue mb-4"></div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-6xl mb-4">
                    {status === 'success' ? 'check_circle' : status === 'duplicate' ? 'warning' : 'cancel'}
                  </span>
                  <h2 className="font-headline-md text-3xl font-bold uppercase tracking-tight leading-tight mb-4">
                    {message}
                  </h2>
                  {status === 'success' && details && (
                    <div className="bg-black/10 p-4 rounded-xl w-full text-left font-body-md mt-4">
                      <p className="text-sm opacity-80 uppercase tracking-wider font-bold">Asistente</p>
                      <p className="text-xl font-bold mb-2">{details.name}</p>
                      <p className="text-sm opacity-80 uppercase tracking-wider font-bold">Tipo</p>
                      <p className="font-bold">{details.type}</p>
                    </div>
                  )}
                  {status === 'duplicate' && (
                    <div className="bg-black/10 p-4 rounded-xl w-full text-left font-body-md mt-4">
                      <p className="font-bold text-sm">Este código ya fue validado en el sistema.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Scanner Container */}
          <div className="bg-surface-container-lowest p-2">
            <div id="reader" className="w-full min-h-[350px] [&_#reader__dashboard_section_csr]:hidden [&_button]:bg-university-blue [&_button]:text-white [&_button]:px-6 [&_button]:py-2 [&_button]:rounded-xl [&_button]:font-bold [&_button]:shadow-md [&_select]:p-3 [&_select]:rounded-xl [&_select]:border-outline-variant [&_select]:bg-surface-white [&_select]:text-on-surface"></div>
          </div>
        </div>

        <div className="flex-1 bg-surface-white rounded-3xl p-8 shadow-sm border border-outline-variant h-fit">
          <h2 className="font-title-lg text-university-blue flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-academic-gold">info</span>
            Instrucciones
          </h2>
          <ul className="space-y-4 text-on-surface-variant font-body-md">
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-university-blue mt-0.5">filter_1</span>
              <div>Asegúrate de otorgar permisos de cámara al navegador al solicitarlo.</div>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-university-blue mt-0.5">filter_2</span>
              <div>Encuadra el código QR del asistente dentro del marco visible del escáner.</div>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-university-blue mt-0.5">filter_3</span>
              <div>El escáner verificará automáticamente la entrada en nuestra base de datos y te mostrará el resultado visualmente.</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
