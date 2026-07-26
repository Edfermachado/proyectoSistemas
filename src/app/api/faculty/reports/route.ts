import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { ReportsService } from "@/services/reports.service";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !["tenant_admin", "event_manager"].includes(session.role as string)) {
      return NextResponse.json(
        { error: "Acceso no autorizado. Se requieren permisos de gestión de facultad." },
        { status: 403 }
      );
    }

    const tenantId = session.tenantId as string;
    if (!tenantId) {
      return NextResponse.json(
        { error: "El usuario no está asignado a ninguna facultad." },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const period = (searchParams.get("period") as "all" | "30days" | "90days" | "year") || "all";
    const departmentId = searchParams.get("departmentId") || undefined;
    const isExportCsv = searchParams.get("export") === "csv";

    const data = await ReportsService.getFacultyMetrics(tenantId, { period, departmentId });

    if (isExportCsv) {
      const headers = [
        "ID Evento",
        "Título del Evento",
        "Departamento",
        "Espacio",
        "Fecha",
        "Precio ($)",
        "Aforo Máximo",
        "Total Inscritos",
        "Confirmados",
        "Asistencia QR (Escaneados)",
        "Tasa Ocupación (%)",
        "Ingresos Generados ($ USD)",
        "Estado",
      ];

      const rows = data.topEvents.map((evt) => [
        evt.id,
        evt.title,
        evt.departmentName,
        evt.spaceName,
        evt.date,
        evt.price,
        evt.capacity,
        evt.totalAttendees,
        evt.confirmedAttendees,
        evt.scannedAttendees,
        `${evt.occupancyRate}%`,
        evt.revenueUsd,
        evt.status,
      ]);

      const safeFacultySlug = data.facultyInfo.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const csvContent = ReportsService.generateCsvString(headers, rows);
      
      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="reporte_${safeFacultySlug}_${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error generating faculty report:", error);
    return NextResponse.json(
      { error: error?.message || "Error al generar el reporte de la facultad." },
      { status: 500 }
    );
  }
}
