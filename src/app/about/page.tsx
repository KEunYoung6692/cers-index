import { AppShell } from "@/components/cers/app-shell";
import { getTranslations, type SupportedLocale } from "@/lib/cers/i18n";

export async function renderAboutPage(locale: SupportedLocale = "en") {
  const t = getTranslations(locale);
  return (
    <AppShell locale={locale}>
      <div className="container py-8">
        <section className="rounded-[40px] border border-slate-200 bg-white px-8 py-10 shadow-elevated dark:border-slate-800 dark:bg-slate-950/80">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-teal-700">{t.about.eyebrow}</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.about.title}</h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
              {t.about.description}
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-[36px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.about.meaningTitle}</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            {t.about.meaningDescription}
          </p>
        </section>

        <section className="mt-6 grid gap-5 xl:grid-cols-2">
          {t.about.dimensions.map((dimension) => (
            <div key={dimension.title} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{dimension.title}</h2>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">{dimension.description}</p>
              <ul className="mt-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {dimension.bullets.map((bullet) => (
                  <li key={bullet} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="mt-6 rounded-[36px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.about.roadmapTitle}</h2>
          <div className="mt-6 grid gap-5 xl:grid-cols-3">
            {t.about.roadmapCards.map((item) => (
              <div key={item.title} className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900">
                <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[36px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.about.industryTitle}</h2>
          <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            {t.about.industryDescription}
          </p>
        </section>

        <section className="mt-6 rounded-[36px] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950/80">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t.about.faqTitle}</h2>
          <div className="mt-6 space-y-4">
            {t.about.faqs.map((faq) => (
              <div key={faq.question} className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900">
                <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">{faq.question}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default async function AboutPage() {
  return renderAboutPage("en");
}
