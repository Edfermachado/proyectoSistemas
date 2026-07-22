export function DashboardLoading() {
  return (
    <div className="space-y-8 w-full animate-pulse p-4 md:p-0">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="space-y-3 w-full md:w-auto">
          <div className="h-10 w-3/4 md:w-64 bg-surface-container-high rounded-xl"></div>
          <div className="h-5 w-full md:w-96 bg-surface-container rounded-lg"></div>
        </div>
        <div className="h-12 w-full md:w-40 bg-surface-container-high rounded-xl"></div>
      </div>

      {/* Content Skeleton */}
      <div className="bg-surface-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden p-4 md:p-6 space-y-6">
        {/* Search bar skeleton */}
        <div className="h-12 w-full md:max-w-md bg-surface-container rounded-xl mb-4 md:mb-8"></div>
        
        {/* Table skeleton */}
        <div className="space-y-4 hidden md:block">
          <div className="h-12 w-full bg-surface-container-low rounded-lg"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl"></div>
          ))}
        </div>

        {/* Mobile Cards Skeleton */}
        <div className="space-y-4 md:hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
