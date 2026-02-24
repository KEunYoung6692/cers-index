import { Suspense } from "react";
import type { Metadata } from "next";
import LogicPageClient from "./LogicPageClient";
import LogicPageSkeleton from "./LogicPageSkeleton";
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
      fallback={<LogicPageSkeleton />}
    >
      <LogicPageClient />
    </Suspense>
  );
}
