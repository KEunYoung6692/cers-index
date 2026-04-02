import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/cers/app-shell";
import { getTranslations, localizedPath, type SupportedLocale } from "@/lib/cers/i18n";

export async function renderAboutPage(locale: SupportedLocale = "en") {
  const t = getTranslations(locale);

  return (
    <AppShell locale={locale}>
      <div className="container py-8">
        <section className="rounded-[40px] border border-slate-200 bg-white px-8 py-10 shadow-elevated dark:border-slate-800 dark:bg-slate-950/80">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-teal-700">{t.about.eyebrow}</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">
              {t.about.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300 md:text-lg">
              {t.about.description}
            </p>
            <div className="mt-7">
              <Link
                href={localizedPath(locale, "/about/logic")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-teal-700"
              >
                {t.about.logicCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.about.meaningTitle}</h2>
            <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">{t.about.meaningDescription}</p>
            <div className="mt-5 space-y-3">
              {t.about.meaningPoints.map((point, index) => (
                <div key={point} className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-900">
                  <div className="text-xs font-medium uppercase tracking-[0.22em] text-teal-700 dark:text-teal-300">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-200">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.about.logicTitle}</h2>
            <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">{t.about.logicDescription}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {t.about.logicSteps.map((item, index) => (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <h3 className="mt-3 text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-4 rounded-[32px] border border-slate-200 bg-white px-6 py-5 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.about.dimensionsTitle}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">{t.about.dimensionsDescription}</p>
          </div>

          <div className="grid gap-5 xl:grid-cols-4">
            {t.about.dimensions.map((dimension) => (
              <div key={dimension.title} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">{dimension.title}</h2>
                  {"weight" in dimension && dimension.weight ? (
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-950/50 dark:text-teal-200">
                      {dimension.weight}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{dimension.description}</p>
                <div className="mt-4 space-y-2">
                  {dimension.bullets.map((bullet) => (
                    <div key={bullet} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                      {bullet}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[36px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
          <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.about.industryTitle}</h2>
              <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">{t.about.industryDescription}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.about.readingTitle}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {t.about.readingCards.map((item) => (
                  <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-900">
                    <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default async function AboutPage() {
  return renderAboutPage("en");
}
