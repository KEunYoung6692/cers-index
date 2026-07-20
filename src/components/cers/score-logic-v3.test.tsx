import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { SupportedLocale } from "@/lib/cers/i18n";
import ScoreLogicV3 from "./score-logic-v3";

const LOCALES: SupportedLocale[] = ["en", "ko", "ja"];
const VARIABLE_CODES = ["E1.", "E2.", "T1.", "T2.", "C1.", "C2.", "C3.", "C4.", "C5.", "R1.", "R2.", "R3.", "R4."];

afterEach(cleanup);

describe("CERs methodology page", () => {
  it.each(LOCALES)("renders the current 13-variable methodology in %s", (locale) => {
    const { container } = render(<ScoreLogicV3 locale={locale} />);
    const text = container.textContent ?? "";

    for (const code of VARIABLE_CODES) expect(text).toContain(code);
    expect(text).toContain("n1=2, n2=2, n3=5, n4=4");
    expect(text).toContain("CERs Index =");
    expect(text).not.toMatch(/Methodology v1\.5|V1\.|V2\.|W1\.|W2\.|A1\.|A2\.|A3\.|A4\.|초안|진행 중|0714|clamp/i);
  });
});
