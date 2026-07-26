"use client";

import { useState } from "react";
import { FacultyMetricsData } from "@/services/reports.service";

interface Props {
  initialData: FacultyMetricsData;
  currentUserEmail: string;
}

export function FacultyMetricsView({ initialData, currentUserEmail }: Props) {
  const [data, setData] = useState<FacultyMetricsData>(initialData);
  const [period, setPeriod] = useState<"all" | "30days" | "90days" | "year">("all");
  const [loading, setLoading] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handlePeriodChange = async (newPeriod: "all" | "30days" | "90days" | "year") => {
    setPeriod(newPeriod);
    setLoading(true);
    try {
      const res = await fetch(`/api/faculty/reports?period=${newPeriod}`);
      if (res.ok) {
        const updated = await res.json();
        setData(updated);
      }
    } catch (e) {
      console.error("Error updating faculty report metrics:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCsv = () => {
    window.open(`/api/faculty/reports?period=${period}&export=csv`, "_blank");
  };

  const filteredEvents = data.topEvents.filter(
    (e) =>
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.spaceName.toLowerCase().includes(searchTerm.toLowerCase())
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
            <span className="material-symbols-outlined text-university-blue text-3xl">analytics</span>
            <h1 className="font-headline-lg text-university-blue text-3xl font-bold">
              Métricas Estratégicas de Facultad
            </h1>
          </div>
          <p className="text-on-surface-variant text-body-md mt-1">
            {data.facultyInfo.name} — <strong className="text-university-blue">{data.facultyInfo.universityName}</strong>
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

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Faculty Revenue USD */}
        <div className="bg-gradient-to-br from-university-blue to-surface-container-high rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group">
          <span className="material-symbols-outlined text-3xl mb-2 text-academic-gold">payments</span>
          <p className="text-xs uppercase tracking-widest font-bold opacity-80">Recaudación Facultad (USD)</p>
          <p className="text-3xl font-black mt-2">{formatUsd(data.summary.totalRevenueUsd)}</p>
          <div className="mt-4 pt-3 border-t border-white/20 flex justify-between items-center text-xs">
            <span>Bolívares Bs:</span>
            <span className="font-bold">{formatBs(data.summary.totalRevenueBs)} Bs</span>
          </div>
        </div>

        {/* Total Events & Approved */}
        <div className="bg-surface-white rounded-3xl p-6 border border-outline-variant shadow-sm relative overflow-hidden group hover:border-academic-gold transition-colors">
          <span className="material-symbols-outlined text-3xl mb-2 text-academic-gold">event_available</span>
          <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">Eventos Publicados</p>
          <p className="text-3xl font-black text-university-blue mt-2">{data.summary.totalEvents}</p>
          <div className="mt-4 pt-3 border-t border-outline-variant flex justify-between items-center text-[11px] text-on-surface-variant">
            <span>Aprob: <strong className="text-success">{data.summary.approvedEvents}</strong></span>
            <span>Pend: <strong className="text-warning">{data.summary.pendingEvents}</strong></span>
            <span>Rech: <strong className="text-error">{data.summary.rejectedEvents}</strong></span>
          </div>
        </div>

        {/* Total Attendees & Confirmed */}
        <div className="bg-surface-white rounded-3xl p-6 border border-outline-variant shadow-sm relative overflow-hidden group hover:border-innovation-purple transition-colors">
          <span className="material-symbols-outlined text-3xl mb-2 text-innovation-purple">groups</span>
          <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">Asistentes Totales</p>
          <p className="text-3xl font-black text-university-blue mt-2">{data.summary.totalAttendees}</p>
          <div className="mt-4 pt-3 border-t border-outline-variant flex justify-between items-center text-xs text-on-surface-variant">
            <span>Confirmados: <strong className="text-success">{data.summary.confirmedAttendees}</strong></span>
            <span>Pendientes: <strong className="text-warning">{data.summary.pendingAttendees}</strong></span>
          </div>
        </div>

        {/* Space Occupancy & Check-In */}
        <div className="bg-surface-white rounded-3xl p-6 border border-outline-variant shadow-sm relative overflow-hidden group hover:border-university-blue transition-colors">
          <span className="material-symbols-outlined text-3xl mb-2 text-university-blue">location_city</span>
          <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">Ocupación de Espacios</p>
          <p className="text-3xl font-black text-university-blue mt-2">{data.summary.occupancyRate}%</p>
          <div className="mt-4 pt-3 border-t border-outline-variant flex justify-between items-center text-xs text-on-surface-variant">
            <span>Asistencia QR:</span>
            <span className="font-bold text-university-blue">{data.summary.checkInRate}%</span>
          </div>
        </div>
      </div>

      {/* Grid: Departments Breakdown & Space Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Breakdown Table */}
        <div className="bg-surface-white rounded-3xl p-8 border border-outline-variant shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-headline-md text-university-blue text-xl font-bold">
                Rendimiento por Departamento
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Aportes de cada departamento o escuela en eventos y recaudación.
              </p>
            </div>
            <span className="material-symbols-outlined text-university-blue text-2xl">account_tree</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-outline-variant text-on-surface-variant uppercase tracking-wider font-bold">
                  <th className="py-3 px-3">Departamento</th>
                  <th className="py-3 px-3 text-center">Eventos</th>
                  <th className="py-3 px-3 text-center">Confirmados</th>
                  <th className="py-3 px-3 text-right">Recaudado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {data.departmentBreakdown.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-on-surface-variant">
                      Sin datos de departamentos disponibles.
                    </td>
                  </tr>
                ) : (
                  data.departmentBreakdown.map((dept) => (
                    <tr key={dept.departmentId} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="py-3.5 px-3 font-bold text-on-surface">{dept.departmentName}</td>
                      <td className="py-3.5 px-3 text-center font-semibold text-university-blue">{dept.totalEvents}</td>
                      <td className="py-3.5 px-3 text-center text-on-surface">{dept.confirmedAttendees}</td>
                      <td className="py-3.5 px-3 text-right font-black text-university-blue">{formatUsd(dept.revenueUsd)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Space Utilization Table */}
        <div className="bg-surface-white rounded-3xl p-8 border border-outline-variant shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-headline-md text-university-blue text-xl font-bold">
                Uso de Espacios Académicos
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Frecuencia de reserva y aforo ocupado por espacio físico.
              </p>
            </div>
            <span className="material-symbols-outlined text-academic-gold text-2xl">roofing</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-outline-variant text-on-surface-variant uppercase tracking-wider font-bold">
                  <th className="py-3 px-3">Espacio</th>
                  <th className="py-3 px-3 text-center">Capacidad</th>
                  <th className="py-3 px-3 text-center">Eventos</th>
                  <th className="py-3 px-3 text-center">Ocupación (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {data.spaceUtilization.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-on-surface-variant">
                      Sin recintos configurados.
                    </td>
                  </tr>
                ) : (
                  data.spaceUtilization.map((sp) => (
                    <tr key={sp.spaceId} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="py-3.5 px-3 font-bold text-on-surface">{sp.spaceName}</td>
                      <td className="py-3.5 px-3 text-center text-on-surface-variant">{sp.capacity} sillas</td>
                      <td className="py-3.5 px-3 text-center font-bold text-university-blue">{sp.eventsCount}</td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="px-2.5 py-1 bg-surface-container-high rounded-full font-bold text-university-blue">
                          {sp.occupancyRate}%
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top Performing Events Leaderboard */}
      <div className="bg-surface-white rounded-3xl p-8 border border-outline-variant shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h3 className="font-headline-md text-university-blue text-xl font-bold">
              Leaderboard de Eventos de la Facultad
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Top de eventos ordenados por aforo logrado e ingresos generados.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-lg">search</span>
            <input
              type="text"
              placeholder="Buscar evento o departamento..."
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
                <th className="py-3 px-3">Departamento</th>
                <th className="py-3 px-3">Espacio</th>
                <th className="py-3 px-3">Fecha</th>
                <th className="py-3 px-3 text-center">Precio</th>
                <th className="py-3 px-3 text-center">Confirmados / Aforo</th>
                <th className="py-3 px-3 text-center">Tasa Asistencia</th>
                <th className="py-3 px-3 text-center">B2B Solicitudes</th>
                <th className="py-3 px-3 text-right">Recaudado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-6 text-center text-on-surface-variant">
                    No se encontraron eventos.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="py-3.5 px-3 font-bold text-on-surface">{evt.title}</td>
                    <td className="py-3.5 px-3 text-on-surface-variant">{evt.departmentName}</td>
                    <td className="py-3.5 px-3 text-on-surface-variant">{evt.spaceName}</td>
                    <td className="py-3.5 px-3 text-on-surface-variant">{evt.date}</td>
                    <td className="py-3.5 px-3 text-center font-bold">
                      {evt.price > 0 ? `$${evt.price}` : <span className="text-success">Gratis</span>}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-university-blue">
                      {evt.confirmedAttendees} / {evt.capacity}
                    </td>
                    <td className="py-3.5 px-3 text-center text-innovation-purple font-bold">
                      {evt.scannedAttendees} ({evt.occupancyRate}%)
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="px-2 py-0.5 bg-academic-gold/10 text-university-blue rounded-full font-bold">
                        {evt.b2bRequestsCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-black text-university-blue">
                      {formatUsd(evt.revenueUsd)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINTABLE FACULTY REPORT MODAL */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto print:p-0">
          <div className="bg-white text-slate-900 w-full max-w-4xl rounded-3xl p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:rounded-none">
            {/* Modal Controls Bar */}
            <div className="flex justify-between items-center pb-6 border-b border-slate-200 print:hidden">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-university-blue">description</span>
                <span className="font-bold text-slate-800">Reporte Ejecutivo de Gestión de Facultad</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
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
            <div className="pt-6 space-y-6 text-sm" id="printable-faculty-report">
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
                <div>
                  <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                    {data.facultyInfo.name}
                  </h1>
                  <p className="text-xs text-slate-600 font-bold uppercase tracking-wider mt-0.5">
                    {data.facultyInfo.universityName} — INFORME INSTITUCIONAL DE GESTIÓN DE EVENTOS ({period.toUpperCase()})
                  </p>
                </div>
                <div className="text-right text-xs text-slate-600">
                  <p><strong>Fecha de Emisión:</strong> {new Date().toLocaleDateString("es-VE")}</p>
                  <p><strong>Generado por:</strong> {currentUserEmail}</p>
                </div>
              </div>

              {/* Summary Cards */}
              <div>
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs mb-3">
                  I. SÍNTESIS OPERATIVA Y FINANCIERA
                </h3>
                <div className="grid grid-cols-4 gap-4 text-xs border border-slate-300 rounded-xl p-4 bg-slate-50">
                  <div>
                    <p className="text-slate-500 font-semibold">RECAUDADO USD</p>
                    <p className="text-lg font-black text-slate-900">{formatUsd(data.summary.totalRevenueUsd)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-semibold">TOTAL EVENTOS</p>
                    <p className="text-lg font-black text-slate-900">{data.summary.totalEvents}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-semibold">ASISTENTES</p>
                    <p className="text-lg font-black text-slate-900">{data.summary.confirmedAttendees}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-semibold">TASA ASISTENCIA QR</p>
                    <p className="text-lg font-black text-slate-900">{data.summary.checkInRate}%</p>
                  </div>
                </div>
              </div>

              {/* Department Breakdown */}
              <div>
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs mb-3">
                  II. RESULTADOS POR DEPARTAMENTO
                </h3>
                <table className="w-full text-left text-xs border-collapse border border-slate-300">
                  <thead className="bg-slate-100 uppercase text-slate-700 font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-2 border-r border-slate-300">Departamento</th>
                      <th className="p-2 text-center border-r border-slate-300">Eventos</th>
                      <th className="p-2 text-center border-r border-slate-300">Inscritos</th>
                      <th className="p-2 text-right">Recaudado (USD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {data.departmentBreakdown.map((dept) => (
                      <tr key={dept.departmentId}>
                        <td className="p-2 font-bold border-r border-slate-200">{dept.departmentName}</td>
                        <td className="p-2 text-center border-r border-slate-200">{dept.totalEvents}</td>
                        <td className="p-2 text-center border-r border-slate-200">{dept.confirmedAttendees}</td>
                        <td className="p-2 text-right font-bold">{formatUsd(dept.revenueUsd)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div className="pt-12 grid grid-cols-2 gap-12 text-center text-xs">
                <div>
                  <div className="border-t border-slate-400 pt-2 font-bold text-slate-800">
                    FIRMA Y SELLO DEL DECANATO
                  </div>
                  <p className="text-slate-500">{data.facultyInfo.name}</p>
                </div>
                <div>
                  <div className="border-t border-slate-400 pt-2 font-bold text-slate-800">
                    COORDINACIÓN ACADÉMICA / EVENTOS
                  </div>
                  <p className="text-slate-500">{data.facultyInfo.universityName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
