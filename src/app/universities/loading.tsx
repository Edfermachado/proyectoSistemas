import { Skeleton } from "@/components/ui/Skeleton";

export default function UniversitiesLoading() {
  return (
    <div className="min-h-screen bg-surface-base pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      <div className="space-y-4 text-center max-w-3xl mx-auto animate-pulse">
        <Skeleton className="h-10 w-2/3 mx-auto rounded-2xl" />
        <Skeleton className="h-5 w-1/2 mx-auto rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-surface-white rounded-3xl p-8 border border-surface-container-highest shadow-sm space-y-6 animate-pulse">
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-2xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
