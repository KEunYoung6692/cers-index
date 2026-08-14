"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Globe2, Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  detectLocaleFromPathname,
  getTranslations,
  localizedPath,
  stripLocalePrefix,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@/lib/cers/i18n";
import { ThemeToggle } from "./theme-toggle";

type SiteHeaderProps = {
  locale?: SupportedLocale;
};

export function SiteHeader({ locale = "en" }: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = getTranslations(locale);
  const unlocalizedPathname = stripLocalePrefix(pathname);
  const activeLocale = detectLocaleFromPathname(pathname) || locale;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [queryString, setQueryString] = useState("");
  const [currentQuery, setCurrentQuery] = useState("");

  const navItems = [
    { href: "/", label: t.nav.home },
    { href: "/companies", label: t.nav.companies },
    { href: "/industries", label: t.nav.industries },
    { href: "/about", label: t.nav.about },
  ];

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQueryString(params.toString());
    setCurrentQuery(params.get("q") || "");
  }, [pathname]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const changeLocale = (targetLocale: SupportedLocale) => {
    const nextHref = localizedPath(targetLocale, unlocalizedPathname === "" ? "/" : unlocalizedPathname);
    router.push(queryString ? `${nextHref}?${queryString}` : nextHref);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/88 backdrop-blur-xl transition-colors dark:border-slate-800/80 dark:bg-slate-950/82">
      <div className="container flex h-[72px] items-center justify-between gap-5">
        <div className="flex min-w-0 items-center gap-8">
          <Link href={localizedPath(locale, "/")} className="flex shrink-0 items-center gap-3 text-slate-950 dark:text-white">
            {/* 파비콘과 동일한 자산 (public/android-chrome-192x192.png) */}
            <Image
              src="/android-chrome-192x192.png"
              alt=""
              width={36}
              height={36}
              priority
              className="h-9 w-9 shrink-0"
            />
            <span className="text-base font-semibold tracking-tight">CERs Index</span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const isActive =
                unlocalizedPathname === item.href || (item.href !== "/" && unlocalizedPathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={localizedPath(locale, item.href)}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-slate-950 font-semibold text-white dark:bg-white dark:text-slate-950"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={localizedPath(locale, "/about/logic")}
            className="hidden rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-700 transition hover:border-teal-300 hover:bg-teal-100 sm:inline-flex dark:border-teal-500/30 dark:bg-teal-950/40 dark:text-teal-300"
          >
            Method v1.5
          </Link>
          <ThemeToggle locale={locale} />

          <div className="relative hidden items-center md:flex">
            <Globe2 className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" aria-hidden />
            <select
              value={activeLocale}
              onChange={(event) => changeLocale(event.target.value as SupportedLocale)}
              aria-label={t.header.languageLabel}
              className="h-10 w-40 appearance-none rounded-full border border-slate-200 bg-slate-50 pl-9 pr-8 text-xs font-medium text-slate-700 outline-none transition focus:border-teal-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {SUPPORTED_LOCALES.map((targetLocale) => (
                <option key={targetLocale} value={targetLocale}>
                  {targetLocale.toUpperCase()} · {t.languages[targetLocale]}
                </option>
              ))}
            </select>
          </div>

          <form action={localizedPath(locale, "/companies")} className="relative hidden w-52 xl:block 2xl:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="search"
              name="q"
              value={currentQuery}
              onChange={(event) => setCurrentQuery(event.target.value)}
              placeholder={t.header.searchPlaceholder}
              className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-teal-500 dark:focus:bg-slate-950"
            />
          </form>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 lg:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-5 lg:hidden dark:border-slate-800 dark:bg-slate-950">
          <div className="container px-0">
            <form action={localizedPath(locale, "/companies")} className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                name="q"
                value={currentQuery}
                onChange={(event) => setCurrentQuery(event.target.value)}
                placeholder={t.header.searchPlaceholder}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-teal-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </form>
            <nav className="mt-4 grid gap-2 sm:grid-cols-2">
              {navItems.map((item) => {
                const isActive =
                  unlocalizedPathname === item.href || (item.href !== "/" && unlocalizedPathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={localizedPath(locale, item.href)}
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm font-medium",
                      isActive
                        ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                        : "bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-200 pt-4 dark:border-slate-800">
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">{t.header.languageLabel}</span>
              <select
                value={activeLocale}
                onChange={(event) => changeLocale(event.target.value as SupportedLocale)}
                aria-label={t.header.languageLabel}
                className="h-10 min-w-48 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none focus:border-teal-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {SUPPORTED_LOCALES.map((targetLocale) => (
                  <option key={targetLocale} value={targetLocale}>
                    {targetLocale.toUpperCase()} · {t.languages[targetLocale]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
