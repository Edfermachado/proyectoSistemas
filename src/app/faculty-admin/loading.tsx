import { MetricsGridSkeleton, TableSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function FacultyAdminLoading() {
  return (
    <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto">
      {/* Top Banner Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface-white p-8 rounded-3xl border border-surface-container-highest shadow-sm animate-pulse">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-lg" />
        </div>
        <Skeleton className="h-12 w-44 rounded-2xl" />
      </div>

      {/* Metrics Section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40 rounded-lg" />
        <MetricsGridSkeleton />
      </div>

      {/* Table Section */}
      <div className="bg-surface-white p-8 rounded-3xl border border-surface-container-highest shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-48 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
        <TableSkeleton rows={6} />
      </div>
    </div>
  );
}
