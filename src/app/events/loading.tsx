import { EventCardSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function EventsLoading() {
  return (
    <div className="min-h-screen bg-surface-base pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header Skeleton */}
      <div className="space-y-4 text-center max-w-3xl mx-auto animate-pulse">
        <Skeleton className="h-10 w-3/4 mx-auto rounded-2xl" />
        <Skeleton className="h-5 w-1/2 mx-auto rounded-lg" />
      </div>

      {/* Filter / Search Bar Skeleton */}
      <div className="bg-surface-white p-4 rounded-3xl border border-surface-container-highest shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center animate-pulse">
        <Skeleton className="h-12 w-full md:w-80 rounded-2xl" />
        <div className="flex gap-3 w-full md:w-auto">
          <Skeleton className="h-12 w-32 rounded-2xl" />
          <Skeleton className="h-12 w-32 rounded-2xl" />
        </div>
      </div>

      {/* Events Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
