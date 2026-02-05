import { Suspense } from "react";
import type { Metadata } from "next";
import LogicPageClient from "./LogicPageClient";
import { getLogicTitle } from "./logic-content";

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { lang?: string };
}): Promise<Metadata> {
  return {
    title: getLogicTitle(searchParams?.lang),
  };
}

export default function LogicPage() {
  return (
    <Suspense
      fallback={(
        <main className="min-h-screen bg-background">
          <div className="container py-6 text-muted-foreground">Loading...</div>
        </main>
      )}
    >
      <LogicPageClient />
    </Suspense>
  );
}
