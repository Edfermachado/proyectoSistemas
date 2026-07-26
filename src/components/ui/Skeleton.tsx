import React from "react";

export function Skeleton({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`animate-pulse bg-surface-variant/60 rounded-xl ${className}`}
      style={style}
    />
  );
}

export function EventCardSkeleton() {
  return (
    <div className="bg-surface-white rounded-3xl border border-surface-container-highest overflow-hidden shadow-sm flex flex-col h-full animate-pulse">
      {/* Media placeholder */}
      <div className="w-full h-48 bg-surface-variant/60 relative">
        <div className="absolute top-4 left-4 w-20 h-6 bg-surface-container-highest rounded-full" />
      </div>
      
      {/* Content placeholder */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-24 h-4 bg-surface-variant/80 rounded-md" />
            <div className="w-16 h-4 bg-surface-variant/60 rounded-md" />
          </div>
          <div className="w-5/6 h-6 bg-surface-container-high rounded-lg" />
          <div className="w-full h-4 bg-surface-variant/50 rounded-md" />
          <div className="w-2/3 h-4 bg-surface-variant/40 rounded-md" />
        </div>

        {/* Footer info placeholder */}
        <div className="pt-4 border-t border-surface-container-highest flex items-center justify-between">
          <div className="w-28 h-5 bg-surface-variant/60 rounded-md" />
          <div className="w-20 h-9 bg-university-blue/20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function MetricsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-surface-white rounded-3xl p-6 border border-surface-container-highest shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-surface-variant/60" />
            <div className="w-12 h-6 rounded-full bg-surface-variant/40" />
          </div>
          <div className="space-y-2">
            <div className="w-20 h-8 bg-surface-container-high rounded-lg" />
            <div className="w-32 h-4 bg-surface-variant/50 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-12 w-full bg-surface-variant/60 rounded-2xl" />
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className="h-16 w-full bg-surface-white rounded-2xl border border-surface-container-highest p-4 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-surface-variant/60" />
            <div className="space-y-2 flex-1">
              <div className="w-1/3 h-4 bg-surface-variant/80 rounded" />
              <div className="w-1/4 h-3 bg-surface-variant/40 rounded" />
            </div>
          </div>
          <div className="w-24 h-6 bg-surface-variant/50 rounded-full" />
        </div>
      ))}
    </div>
  );
}
