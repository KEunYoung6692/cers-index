import ScoreLogic from "@/components/cers/score-logic";
import { AppShell } from "@/components/cers/app-shell";
import type { SupportedLocale } from "@/lib/cers/i18n";

export function renderScoreLogicPage(locale: SupportedLocale = "en") {
  return (
    <AppShell locale={locale}>
      <ScoreLogic locale={locale} />
    </AppShell>
  );
}

export default async function ScoreLogicPage() {
  return renderScoreLogicPage("en");
}
