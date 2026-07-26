import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReportsService } from "@/services/reports.service";
import { SuperAdminMetricsView } from "@/components/reports/SuperAdminMetricsView";

export default async function SuperadminMetricsPage() {
  const session = await getSession();
  if (!session || session.role !== "superadmin") {
    redirect("/admin/login");
  }

  const initialData = await ReportsService.getSuperAdminMetrics({ period: "all" });

  return (
    <SuperAdminMetricsView
      initialData={initialData}
      currentUserEmail={String(session.email)}
    />
  );
}
