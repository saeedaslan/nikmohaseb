import { TableSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-7 w-32 animate-pulse rounded bg-surface-background" />
      </div>
      <TableSkeleton rows={8} columns={5} />
    </div>
  );
}
