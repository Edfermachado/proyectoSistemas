"use client";

import { useState } from "react";
import { SuperAdminMetricsData } from "@/services/reports.service";

interface Props {
  initialData: SuperAdminMetricsData;
  currentUserEmail: string;
}

export function SuperAdminMetricsView({ initialData, currentUserEmail }: Props) {
  const [data, setData] = useState<SuperAdminMetricsData>(initialData);
  const [period, setPeriod] = useState<"all" | "30days" | "90days" | "year">("all");
  const [loading, setLoading] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handlePeriodChange = async (newPeriod: "all" | "30days" | "90days" | "year") => {
    setPeriod(newPeriod);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reports?period=${newPeriod}`);
      if (res.ok) {
        const updated = await res.json();
        setData(updated);
      }
    } catch (e) {
      console.error("Error updating report metrics:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCsv = () => {
    window.location.href = `/api/admin/reports?period=${period}&export=csv`;
  };

  const filteredEvents = data.detailedEvents.filter(
    (e) =>
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.facultyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.universityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatUsd = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);

  const formatBs = (val: number) =>
    new Intl.NumberFormat("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-surface-white p-6 rounded-3xl border border-outline-variant shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-university-blue text-3xl">insights</span>
            <h1 className="font-headline-lg text-university-blue text-3xl font-bold">
              Inteligencia Global y Reportes
            </h1>
          </div>
          <p className="text-on-surface-variant text-body-md mt-1">
            Analítica consolidada del modelo de negocios y métricas clave de la red universitaria.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Period Filter */}
          <div className="bg-surface-container-lowest border border-outline-variant p-1 rounded-2xl flex text-xs font-bold shadow-inner">
            <button
              onClick={() => handlePeriodChange("all")}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                period === "all" ? "bg-university-blue text-white shadow-sm" : "text-on-surface-variant hover:text-university-blue"
              }`}
            >
              Histórico
            </button>
            <button
              onClick={() => handlePeriodChange("year")}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                period === "year" ? "bg-university-blue text-white shadow-sm" : "text-on-surface-variant hover:text-university-blue"
              }`}
            >
              Este Año
            </button>
            <button
              onClick={() => handlePeriodChange("90days")}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                period === "90days" ? "bg-university-blue text-white shadow-sm" : "text-on-surface-variant hover:text-university-blue"
              }`}
            >
              90 Días
            </button>
            <button
              onClick={() => handlePeriodChange("30days")}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                period === "30days" ? "bg-university-blue text-white shadow-sm" : "text-on-surface-variant hover:text-university-blue"
              }`}
            >
              30 Días
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface-white border border-outline-variant hover:border-academic-gold text-university-blue rounded-2xl transition-all text-sm font-bold shadow-sm hover:shadow cursor-pointer"
          >
            <span className="material-symbols-outlined text-academic-gold text-lg">csv</span>
            Exportar CSV
          </button>

          <button
            onClick={() => setShowPrintModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-university-blue to-innovation-purple hover:opacity-95 text-white rounded-2xl transition-all text-sm font-bold shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">print</span>
            Reporte Ejecutivo PDF
          </button>
        </div>
      </div>

      {loading && (
        <div className="w-full h-1 bg-surface-container-high overflow-hidden rounded-full">
          <div className="w-full h-full bg-university-blue animate-pulse"></div>
        </div>
      )}

      {/* Main Financial & Strategic KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue USD Card */}
        <div className="bg-gradient-to-br from-university-blue to-surface-container-high rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-28 h-28 bg-white opacity-10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
          <span className="material-symbols-outlined text-3xl mb-2 text-academic-gold">payments</span>
          <p className="text-xs uppercase tracking-widest font-bold opacity-80">Ingresos Totales (USD)</p>
          <p className="text-3xl font-black mt-2">{formatUsd(data.summary.totalRevenueUsd)}</p>
          <div className="mt-4 pt-3 border-t border-white/20 flex justify-between items-center text-xs">
            <span>Abonos Pago Móvil:</span>
            <span className="font-bold">{formatBs(data.summary.totalRevenueBs)} Bs</span>
          </div>
        </div>

        {/* Network Reach & Scale */}
        <div className="bg-surface-white rounded-3xl p-6 border border-outline-variant shadow-sm relative overflow-hidden group hover:border-academic-gold transition-colors">
          <span className="material-symbols-outlined text-3xl mb-2 text-academic-gold">domain</span>
          <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">Red Universitaria</p>
          <p className="text-3xl font-black text-university-blue mt-2">{data.summary.totalUniversities} Unis</p>
          <div className="mt-4 pt-3 border-t border-outline-variant flex justify-between items-center text-xs text-on-surface-variant">
            <span>Facultades: <strong className="text-university-blue">{data.summary.totalFaculties}</strong></span>
            <span>Espacios: <strong className="text-university-blue">{data.summary.totalSpaces}</strong></span>
          </div>
        </div>

        {/* Operations Breakdown */}
        <div className="bg-surface-white rounded-3xl p-6 border border-outline-variant shadow-sm relative overflow-hidden group hover:border-innovation-purple transition-colors">
          <span className="material-symbols-outlined text-3xl mb-2 text-innovation-purple">event_available</span>
          <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">Operaciones / Eventos</p>
          <p className="text-3xl font-black text-university-blue mt-2">{data.summary.totalEvents}</p>
          <div className="mt-4 pt-3 border-t border-outline-variant flex justify-between items-center text-[11px] text-on-surface-variant">
            <span>Aprob: <strong className="text-success">{data.summary.approvedEvents}</strong></span>
            <span>Pend: <strong className="text-warning">{data.summary.pendingEvents}</strong></span>
            <span>Rech: <strong className="text-error">{data.summary.rejectedEvents}</strong></span>
          </div>
        </div>

        {/* Check-In Rate & Attendance */}
        <div className="bg-surface-white rounded-3xl p-6 border border-outline-variant shadow-sm relative overflow-hidden group hover:border-university-blue transition-colors">
          <span className="material-symbols-outlined text-3xl mb-2 text-university-blue">qr_code_scanner</span>
          <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">Asistencia Real (QR)</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-black text-university-blue">{data.summary.checkInRate}%</p>
            <span className="text-xs text-on-surface-variant">({data.summary.scannedAttendees} / {data.summary.confirmedAttendees})</span>
          </div>
          <div className="mt-4 pt-3 border-t border-outline-variant flex justify-between items-center text-xs text-on-surface-variant">
            <span>Tasa de Ocupación:</span>
            <span className="font-bold text-university-blue">{data.summary.occupancyRate}%</span>
          </div>
        </div>
      </div>

      {/* Grid Section: Faculty Ranking & Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Faculty Commercial Leaderboard */}
        <div className="lg:col-span-2 bg-surface-white rounded-3xl p-8 border border-outline-variant shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-headline-md text-university-blue text-xl font-bold">
                Ranking Comercial por Facultad
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Rendimiento de eventos, captación de público e ingresos generados.
              </p>
            </div>
            <span className="material-symbols-outlined text-academic-gold text-2xl">trophy</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-outline-variant text-on-surface-variant text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">Facultad / Universidad</th>
                  <th className="py-3 px-4 text-center">Eventos</th>
                  <th className="py-3 px-4 text-center">Confirmados</th>
                  <th className="py-3 px-4 text-center">Asistencia QR</th>
                  <th className="py-3 px-4 text-right">Recaudado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {data.facultyRanking.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-on-surface-variant">
                      No hay datos registrados en el período seleccionado.
                    </td>
                  </tr>
                ) : (
                  data.facultyRanking.map((fac, idx) => (
                    <tr key={fac.tenantId} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                              idx === 0
                                ? "bg-academic-gold text-university-blue"
                                : idx === 1
                                ? "bg-outline-variant text-on-surface"
                                : "bg-surface-container-high text-on-surface-variant"
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <div>
                            <p className="font-bold text-on-surface">{fac.facultyName}</p>
                            <p className="text-xs text-on-surface-variant">{fac.universityName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-semibold text-university-blue">{fac.totalEvents}</td>
                      <td className="py-4 px-4 text-center text-on-surface font-semibold">{fac.confirmedAttendees}</td>
                      <td className="py-4 px-4 text-center text-xs">
                        <span className="px-2.5 py-1 bg-surface-container-high rounded-full font-bold text-university-blue">
                          {fac.scannedAttendees}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-black text-university-blue">
                        {formatUsd(fac.revenueUsd)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Demographics & B2B Requests Summary */}
        <div className="space-y-6">
          {/* Demographics Card */}
          <div className="bg-surface-white rounded-3xl p-6 border border-outline-variant shadow-sm">
            <h3 className="font-headline-sm text-university-blue text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-innovation-purple">pie_chart</span>
              Composición de Audiencia
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-university-blue">Estudiantes Universitarios</span>
                  <span>{data.summary.estudiantesCount}</span>
                </div>
                <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-university-blue h-full rounded-full"
                    style={{
                      width: `${
                        data.summary.totalAttendees > 0
                          ? Math.round((data.summary.estudiantesCount / data.summary.totalAttendees) * 100)
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-innovation-purple">Público Foráneo / Externo</span>
                  <span>{data.summary.foraneosCount}</span>
                </div>
                <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-innovation-purple h-full rounded-full"
                    style={{
                      width: `${
                        data.summary.totalAttendees > 0
                          ? Math.round((data.summary.foraneosCount / data.summary.totalAttendees) * 100)
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* B2B Commercial Requests */}
          <div className="bg-surface-white rounded-3xl p-6 border border-outline-variant shadow-sm">
            <h3 className="font-headline-sm text-university-blue text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-academic-gold">handshake</span>
              Solicitudes B2B Institucionales
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {data.b2bRequestsSummary.map((req) => (
                <div key={req.requestType} className="p-3 bg-surface-container-lowest border border-outline-variant rounded-2xl">
                  <p className="text-on-surface-variant font-medium capitalize">
                    {req.requestType.replace(/_/g, " ")}
                  </p>
                  <p className="text-2xl font-black text-university-blue mt-1">{req.count}</p>
                </div>
              ))}
              {data.b2bRequestsSummary.length === 0 && (
                <p className="text-xs text-on-surface-variant col-span-2 py-2">No hay solicitudes B2B en este período.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Operations & Events Master List */}
      <div className="bg-surface-white rounded-3xl p-8 border border-outline-variant shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h3 className="font-headline-md text-university-blue text-xl font-bold">
              Registro Master de Eventos del Sistema
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Desglose detallado listo para auditoría comercial e inspección institucional.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-lg">search</span>
            <input
              type="text"
              placeholder="Buscar por evento o facultad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-surface-container-lowest border border-outline-variant rounded-xl focus:outline-none focus:border-university-blue"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-outline-variant text-on-surface-variant uppercase tracking-wider font-bold">
                <th className="py-3 px-3">Evento</th>
                <th className="py-3 px-3">Facultad / Univ.</th>
                <th className="py-3 px-3">Espacio</th>
                <th className="py-3 px-3">Fecha</th>
                <th className="py-3 px-3 text-center">Precio</th>
                <th className="py-3 px-3 text-center">Aforo</th>
                <th className="py-3 px-3 text-center">Confirmados</th>
                <th className="py-3 px-3 text-center">Escaneados</th>
                <th className="py-3 px-3 text-center">B2B Solicitudes</th>
                <th className="py-3 px-3 text-right">Recaudado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-6 text-center text-on-surface-variant">
                    No se encontraron eventos coincidentes.
                  </td>
                </tr>
              ) : (
                filteredEvents.slice(0, 50).map((evt) => (
                  <tr key={evt.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="py-3 px-3 font-bold text-on-surface">{evt.title}</td>
                    <td className="py-3 px-3 text-on-surface-variant">
                      {evt.facultyName} <span className="text-black/40">({evt.universityName})</span>
                    </td>
                    <td className="py-3 px-3 text-on-surface-variant">{evt.spaceName}</td>
                    <td className="py-3 px-3 text-on-surface-variant">{evt.date}</td>
                    <td className="py-3 px-3 text-center font-bold">
                      {evt.price > 0 ? `$${evt.price}` : <span className="text-success">Gratis</span>}
                    </td>
                    <td className="py-3 px-3 text-center">{evt.capacity}</td>
                    <td className="py-3 px-3 text-center font-bold text-university-blue">{evt.confirmedAttendees}</td>
                    <td className="py-3 px-3 text-center text-innovation-purple font-bold">{evt.scannedAttendees}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 bg-academic-gold/10 text-university-blue rounded-full font-bold">
                        {evt.b2bRequestsCount}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-black text-university-blue">{formatUsd(evt.revenueUsd)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINTABLE EXECUTIVE REPORT MODAL */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto print:p-0">
          <div className="bg-white text-slate-900 w-full max-w-4xl rounded-3xl p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:rounded-none">
            {/* Modal Controls Bar */}
            <div className="flex justify-between items-center pb-6 border-b border-slate-200 print:hidden">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-university-blue">description</span>
                <span className="font-bold text-slate-800">Vista Previa de Reporte Oficial</span>
              </div>
              <div className="flex items-center gap-3">
                <style type="text/css" media="print">
                  {`
                    @page { size: auto; margin: 10mm; }
                    * {
                      -webkit-print-color-adjust: exact !important;
                      print-color-adjust: exact !important;
                    }
                  `}
                </style>
                <button
                  onClick={() => {
                    const originalTitle = document.title;
                    document.title = `Reporte_Ejecutivo_Global_${period}_${new Date().toISOString().split('T')[0]}`;
                    window.print();
                    setTimeout(() => { document.title = originalTitle; }, 500);
                  }}
                  className="px-4 py-2 bg-university-blue text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-university-blue/90 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">print</span> Imprimir / Guardar PDF
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div className="pt-6 space-y-6 text-sm" id="printable-report">
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                    UniEvents Platform - Reporte de Gestión Global
                  </h1>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    REPORTE ESTRATÉGICO DE RENDIMIENTO ACADÉMICO Y COMERCIAL ({period.toUpperCase()})
                  </p>
                </div>
                <div className="text-right text-xs text-slate-600">
                  <p><strong>Fecha de Emisión:</strong> {new Date().toLocaleDateString("es-VE")}</p>
                  <p><strong>Generado por:</strong> {currentUserEmail}</p>
                  <p><strong>Rol:</strong> Superadministrador Global</p>
                </div>
              </div>

              {/* Executive Summary Cards */}
              <div>
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs mb-3">
                  I. RESUMEN EJECUTIVO DE INDICADORES (KPIs)
                </h3>
                <div className="grid grid-cols-4 gap-4 text-xs border border-slate-300 rounded-xl p-4 bg-slate-50">
                  <div>
                    <p className="text-slate-500 font-semibold">RECAUDACIÓN USD</p>
                    <p className="text-lg font-black text-slate-900">{formatUsd(data.summary.totalRevenueUsd)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-semibold">FACULTADES ACTIVAS</p>
                    <p className="text-lg font-black text-slate-900">{data.summary.totalFaculties}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-semibold">TOTAL ASISTENTES</p>
                    <p className="text-lg font-black text-slate-900">{data.summary.totalAttendees}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-semibold">ASISTENCIA REAL QR</p>
                    <p className="text-lg font-black text-slate-900">{data.summary.checkInRate}%</p>
                  </div>
                </div>
              </div>

              {/* Faculty Ranking */}
              <div>
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs mb-3">
                  II. RENDIMIENTO POR FACULTAD DE LA RED
                </h3>
                <table className="w-full text-left text-xs border-collapse border border-slate-300">
                  <thead className="bg-slate-100 uppercase text-slate-700 font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-2 border-r border-slate-300">Facultad</th>
                      <th className="p-2 border-r border-slate-300">Universidad</th>
                      <th className="p-2 text-center border-r border-slate-300">Eventos</th>
                      <th className="p-2 text-center border-r border-slate-300">Asistentes</th>
                      <th className="p-2 text-right">Recaudado (USD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {data.facultyRanking.map((fac) => (
                      <tr key={fac.tenantId}>
                        <td className="p-2 font-bold border-r border-slate-200">{fac.facultyName}</td>
                        <td className="p-2 border-r border-slate-200">{fac.universityName}</td>
                        <td className="p-2 text-center border-r border-slate-200">{fac.totalEvents}</td>
                        <td className="p-2 text-center border-r border-slate-200">{fac.confirmedAttendees}</td>
                        <td className="p-2 text-right font-bold">{formatUsd(fac.revenueUsd)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div className="pt-12 grid grid-cols-2 gap-12 text-center text-xs">
                <div>
                  <div className="border-t border-slate-400 pt-2 font-bold text-slate-800">
                    DIRECCIÓN EJECUTIVA DE TECNOLOGÍA
                  </div>
                  <p className="text-slate-500">Superadministración de Sistema</p>
                </div>
                <div>
                  <div className="border-t border-slate-400 pt-2 font-bold text-slate-800">
                    AUDITORÍA Y CONTROL DE GESTIÓN
                  </div>
                  <p className="text-slate-500">Red Universitaria Nacional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
