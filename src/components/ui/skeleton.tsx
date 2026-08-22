"use client";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-surface-background ${className ?? ""}`}
    />
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="border-b border-border bg-surface-card p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-border bg-surface-card">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIdx) => (
                <Skeleton key={colIdx} className="h-4 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-surface-card p-6">
      <Skeleton className="mb-4 h-6 w-1/3" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-2 h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-11 w-full" />
          </div>
        ))}
      </div>
      <Skeleton className="h-11 w-24" />
    </div>
  );
}
