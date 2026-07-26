import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReportsService } from "@/services/reports.service";
import { FacultyMetricsView } from "@/components/reports/FacultyMetricsView";

export default async function FacultyMetricsPage() {
  const session = await getSession();
  if (!session || !["tenant_admin", "event_manager"].includes(session.role as string)) {
    redirect("/login");
  }

  const tenantId = session.tenantId as string;
  if (!tenantId) {
    redirect("/login");
  }

  const initialData = await ReportsService.getFacultyMetrics(tenantId, { period: "all" });

  return (
    <FacultyMetricsView
      initialData={initialData}
      currentUserEmail={String(session.email)}
    />
  );
}
