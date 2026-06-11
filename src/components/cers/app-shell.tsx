import { Suspense, type ReactNode } from "react";
import { getTranslations, type SupportedLocale } from "@/lib/cers/i18n";
import { SiteHeader } from "./site-header";

type AppShellProps = {
  children: ReactNode;
  source?: "db" | "fallback";
  issue?: string | null;
  locale?: SupportedLocale;
};

function SiteHeaderFallback({ locale = "en" }: { locale?: SupportedLocale }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur transition-colors dark:border-slate-800/80 dark:bg-slate-950/85">
      <div className="container flex h-16 items-center">
        <div className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">CERs Index</div>
        <div className="ml-auto text-xs text-slate-400 dark:text-slate-500">{locale.toUpperCase()}</div>
      </div>
    </header>
  );
}

export function AppShell({ children, source, issue, locale = "en" }: AppShellProps) {
  const t = getTranslations(locale);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(13,148,136,0.08),_transparent_30%),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] transition-colors dark:bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.14),_transparent_24%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)]">
      <Suspense fallback={<SiteHeaderFallback locale={locale} />}>
        <SiteHeader locale={locale} />
      </Suspense>
      <main className="pb-10">
        {(issue || source === "fallback") && (
          <div className="container pt-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800/70 dark:bg-amber-950/60 dark:text-amber-100">
              {issue || t.alerts.fallbackSampleData}
            </div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
