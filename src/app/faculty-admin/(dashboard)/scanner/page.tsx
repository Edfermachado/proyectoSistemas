"use client";

import { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

type ScanStatus = "idle" | "loading" | "success" | "duplicate" | "error";

export default function ScannerPage() {
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [message, setMessage] = useState("");
  const [details, setDetails] = useState<any>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState("");
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    // Inicializar la instancia base (sin arrancar la cámara aún)
    scannerRef.current = new Html5Qrcode("reader");

    return () => {
      // Limpieza en caso de desmontaje del componente
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startScanning = async () => {
    if (!scannerRef.current) return;
    setCameraError("");
    
    try {
      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          // Prevenir múltiples lecturas consecutivas mientras procesamos
          if (isProcessingRef.current) return;
          
          isProcessingRef.current = true;
          setStatus("loading");

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

          // Esperar unos segundos antes de permitir otra lectura
          setTimeout(() => {
            setStatus("idle");
            setMessage("");
            setDetails(null);
            isProcessingRef.current = false;
          }, 3500);
        },
        (error) => {
          // Ignorar los errores frecuentes de "código no encontrado" frame por frame
        }
      );
      setIsScanning(true);
    } catch (err) {
      console.error("Error iniciando cámara:", err);
      setCameraError("No se pudo acceder a la cámara. Verifica los permisos de tu navegador.");
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
        setStatus("idle");
        isProcessingRef.current = false;
      } catch (err) {
        console.error("Error deteniendo cámara:", err);
      }
    }
  };

  return (
    <div className="flex flex-col animate-fade-in">
      <div className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-university-blue">Escáner de Accesos</h1>
        <p className="text-on-surface-variant mt-2 font-body-md max-w-2xl">
          Verifica la autenticidad de las entradas escaneando el código QR. El sistema registrará la asistencia automáticamente.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-[500px] bg-surface-white rounded-3xl overflow-hidden shadow-xl border border-outline-variant relative flex flex-col">
          
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
          <div className="bg-black flex-1 relative min-h-[350px] flex items-center justify-center">
            {!isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 p-6 text-center z-10">
                <span className="material-symbols-outlined text-6xl mb-4 opacity-50">qr_code_scanner</span>
                <p>La cámara está apagada.</p>
                {cameraError && <p className="text-error mt-2 text-sm">{cameraError}</p>}
              </div>
            )}
            <div id="reader" className="w-full h-full"></div>
          </div>
          
          {/* Custom Controls */}
          <div className="p-4 bg-surface-container-lowest border-t border-outline-variant flex justify-center gap-4">
            {!isScanning ? (
              <button 
                onClick={startScanning}
                className="flex items-center gap-2 px-6 py-3 bg-university-blue text-white rounded-xl font-bold shadow-md hover:bg-university-blue/90 transition-colors w-full justify-center"
              >
                <span className="material-symbols-outlined">videocam</span>
                Iniciar Escáner
              </button>
            ) : (
              <button 
                onClick={stopScanning}
                className="flex items-center gap-2 px-6 py-3 bg-error text-white rounded-xl font-bold shadow-md hover:bg-error/90 transition-colors w-full justify-center"
              >
                <span className="material-symbols-outlined">videocam_off</span>
                Detener Escáner
              </button>
            )}
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
              <div>Haz clic en <strong>Iniciar Escáner</strong> y otorga permisos de cámara al navegador si se solicita.</div>
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
