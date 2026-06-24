import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { KpiScoreGrid } from "./kpi-score-grid";
import type { CersCategoryScore } from "@/lib/cers/types";

const categories: CersCategoryScore[] = [68, 72, 55, 81].map((score, index) => ({
  id: `kpi-${index + 1}`,
  code: `cat${index + 1}`,
  label: `KPI ${index + 1}`,
  weight: 0.25,
  displayOrder: index + 1,
  rawScore: score,
  weightedScore: score / 4,
}));

afterEach(cleanup);

describe("KpiScoreGrid", () => {
  it("renders the four KPI scores without calculating replacements", () => {
    const { container } = render(<KpiScoreGrid categories={categories} locale="en" />);
    const text = container.textContent ?? "";

    expect(text).toContain("Realized decarbonization");
    expect(text).toContain("Target ambition & delivery");
    expect(text).toContain("Capital allocation");
    expect(text).toContain("Data credibility");
    expect(text).toContain("68.0");
    expect(text).toContain("81.0");
  });

  it("renders an em dash for unavailable KPI results", () => {
    const pending = categories.map((category) => ({ ...category, rawScore: null }));
    const { container } = render(<KpiScoreGrid categories={pending} locale="ko" />);

    expect(container.textContent).toContain("—");
    expect(container.textContent).toContain("실질 탈탄소 성과");
  });
});
