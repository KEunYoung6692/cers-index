"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  detectLocaleFromPathname,
  getTranslations,
  localizedPath,
  stripLocalePrefix,
  type SupportedLocale,
} from "@/lib/cers/i18n";
import { ThemeToggle } from "./theme-toggle";

type SiteHeaderProps = {
  locale?: SupportedLocale;
};

export function SiteHeader({ locale = "en" }: SiteHeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = getTranslations(locale);
  const currentQuery = searchParams.get("q") || "";
  const unlocalizedPathname = stripLocalePrefix(pathname);
  const activeLocale = detectLocaleFromPathname(pathname) || locale;

  const navItems = [
    { href: "/", label: t.nav.home },
    { href: "/companies", label: t.nav.companies },
    { href: "/compare", label: t.nav.compare },
    { href: "/industries", label: t.nav.industries },
    { href: "/about", label: t.nav.about },
  ];

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur transition-colors dark:border-slate-800/80 dark:bg-slate-950/85">
      <div className="container flex h-16 items-center justify-between gap-6">
        <div className="flex min-w-0 items-center gap-8">
          <Link href={localizedPath(locale, "/")} className="shrink-0 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            CERs Index
          </Link>
          <nav className="hidden items-center gap-5 md:flex">
            {navItems.map((item) => {
              const isActive =
                unlocalizedPathname === item.href || (item.href !== "/" && unlocalizedPathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={localizedPath(locale, item.href)}
                  className={cn(
                    "text-sm transition-colors",
                    isActive
                      ? "font-medium text-slate-900 dark:text-slate-100"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle locale={locale} />

          <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-900">
            {(["en", "ko", "ja"] as const).map((targetLocale) => {
              const nextHref = localizedPath(targetLocale, unlocalizedPathname === "" ? "/" : unlocalizedPathname);
              const queryString = searchParams.toString();

              return (
                <Link
                  key={targetLocale}
                  href={queryString ? `${nextHref}?${queryString}` : nextHref}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition",
                    activeLocale === targetLocale
                      ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
                  )}
                  aria-label={`${t.header.languageLabel}: ${t.languages[targetLocale]}`}
                >
                  {targetLocale.toUpperCase()}
                </Link>
              );
            })}
          </div>

          <form action={localizedPath(locale, "/companies")} className="relative hidden w-full max-w-sm md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="search"
              name="q"
              defaultValue={currentQuery}
              placeholder={t.header.searchPlaceholder}
              className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-teal-500 dark:focus:bg-slate-950"
            />
          </form>
        </div>
      </div>
    </header>
  );
}
