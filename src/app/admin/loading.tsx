import { MetricsGridSkeleton, TableSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function AdminLoading() {
  return (
    <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface-white p-8 rounded-3xl border border-surface-container-highest shadow-sm animate-pulse">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-8 w-72 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-lg" />
        </div>
        <Skeleton className="h-12 w-48 rounded-2xl" />
      </div>

      <MetricsGridSkeleton />

      <div className="bg-surface-white p-8 rounded-3xl border border-surface-container-highest shadow-sm space-y-6">
        <Skeleton className="h-7 w-56 rounded-xl" />
        <TableSkeleton rows={5} />
      </div>
    </div>
  );
}
