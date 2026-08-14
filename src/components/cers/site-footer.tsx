import Image from "next/image";
import Link from "next/link";
import { getTranslations, localizedPath, type SupportedLocale } from "@/lib/cers/i18n";

export function SiteFooter({ locale = "en" }: { locale?: SupportedLocale }) {
  const t = getTranslations(locale);

  return (
    <footer className="border-t border-slate-200/80 bg-white/70 dark:border-slate-800 dark:bg-slate-950/60">
      <div className="container grid gap-8 py-10 md:grid-cols-[1.25fr_0.75fr] md:items-end">
        <div className="max-w-xl">
          <div className="flex items-center gap-3">
            {/* 헤더 로고와 동일한 파비콘 자산 */}
            <Image
              src="/android-chrome-192x192.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 shrink-0"
            />

            <div className="font-semibold tracking-tight text-slate-950 dark:text-white">CERs Index</div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{t.footer.description}</p>
        </div>

        <div className="md:text-right">
          <nav className="flex flex-wrap gap-x-5 gap-y-3 md:justify-end">
            <Link className="text-sm text-slate-600 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-300" href={localizedPath(locale, "/companies")}>
              {t.nav.companies}
            </Link>
            <Link className="text-sm text-slate-600 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-300" href={localizedPath(locale, "/industries")}>
              {t.nav.industries}
            </Link>
            <Link className="text-sm text-slate-600 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-300" href={localizedPath(locale, "/about")}>
              {t.nav.about}
            </Link>
          </nav>
          <p className="mt-4 text-xs leading-6 text-slate-400 dark:text-slate-500">{t.footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
