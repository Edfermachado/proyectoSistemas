import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { ReportsService } from "@/services/reports.service";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "superadmin") {
      return NextResponse.json(
        { error: "Acceso no autorizado. Se requieren permisos de Superadmin." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const period = (searchParams.get("period") as "all" | "30days" | "90days" | "year") || "all";
    const isExportCsv = searchParams.get("export") === "csv";

    const data = await ReportsService.getSuperAdminMetrics({ period });

    if (isExportCsv) {
      const headers = [
        "ID Evento",
        "Título del Evento",
        "Facultad",
        "Universidad",
        "Espacio",
        "Fecha",
        "Precio ($)",
        "Aforo Total",
        "Inscritos Totales",
        "Confirmados",
        "Asistieron (Escaneados)",
        "Ingresos Generados ($ USD)",
        "Estado",
      ];

      const rows = data.detailedEvents.map((evt) => [
        evt.id,
        evt.title,
        evt.facultyName,
        evt.universityName,
        evt.spaceName,
        evt.date,
        evt.price,
        evt.capacity,
        evt.totalAttendees,
        evt.confirmedAttendees,
        evt.scannedAttendees,
        evt.revenueUsd,
        evt.status,
      ]);

      const csvContent = ReportsService.generateCsvString(headers, rows);
      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="reporte_red_universitaria_${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error generating superadmin report:", error);
    return NextResponse.json(
      { error: error?.message || "Error al procesar el reporte de superadmin." },
      { status: 500 }
    );
  }
}
