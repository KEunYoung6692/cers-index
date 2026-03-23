"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { detectLocaleFromPathname, getTranslations, localizedPath } from "@/lib/cers/i18n";

const NotFound = () => {
  const pathname = usePathname();
  const locale = detectLocaleFromPathname(pathname);
  const t = getTranslations(locale);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", pathname);
  }, [pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(13,148,136,0.08),_transparent_35%),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] px-6 dark:bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.14),_transparent_24%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)]">
      <div className="w-full max-w-xl rounded-[36px] border border-slate-200 bg-white p-10 text-center shadow-elevated dark:border-slate-800 dark:bg-slate-950/80">
        <div className="text-xs font-medium uppercase tracking-[0.28em] text-teal-700">404</div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.notFound.title}</h1>
        <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
          {t.notFound.description}
        </p>
        <Link
          href={localizedPath(locale, "/")}
          className="mt-8 inline-flex rounded-full bg-teal-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-teal-700"
        >
          {t.notFound.returnHome}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
