import { Skeleton } from "@/components/ui/skeleton";

export default function TablePageSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-9 w-36" />
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Skeleton className="h-9 w-[160px]" />
          <Skeleton className="h-9 w-[220px]" />
          <Skeleton className="h-9 w-56" />
          <Skeleton className="ml-auto h-9 w-[220px]" />
        </div>

        <div className="overflow-hidden rounded-lg border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
            <Skeleton className="h-4 w-44" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-[90px]" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>

          <div className="px-4 py-3">
            <div className="grid grid-cols-[2.2fr_1.8fr_repeat(6,minmax(70px,1fr))] gap-3 border-b pb-3">
              {Array.from({ length: 8 }).map((_, idx) => (
                <Skeleton key={`head-${idx}`} className="h-4 w-full" />
              ))}
            </div>
            <div className="space-y-3 py-3">
              {Array.from({ length: 10 }).map((_, rowIdx) => (
                <div
                  key={`row-${rowIdx}`}
                  className="grid grid-cols-[2.2fr_1.8fr_repeat(6,minmax(70px,1fr))] gap-3"
                >
                  {Array.from({ length: 8 }).map((__, colIdx) => (
                    <Skeleton key={`cell-${rowIdx}-${colIdx}`} className="h-5 w-full" />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t px-4 py-3">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
    </main>
  );
}
