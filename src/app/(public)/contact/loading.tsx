import { CardSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-8 w-48 animate-pulse rounded bg-surface-background" />
          <div className="mx-auto h-4 w-64 animate-pulse rounded bg-surface-background" />
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-6 w-full animate-pulse rounded bg-surface-background" />
            ))}
          </div>
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}
