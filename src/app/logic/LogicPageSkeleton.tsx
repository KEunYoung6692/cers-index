import { Skeleton } from "@/components/ui/skeleton";

export default function LogicPageSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-9 w-36" />
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="mb-4 grid gap-4 md:grid-cols-3">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-[68vh] w-full rounded-md" />
        </div>
      </div>
    </main>
  );
}
