import { describe, expect, it } from "vitest";
import type { Company } from "@/data/mockData";
import { compareCompaniesByMarketCapDesc } from "@/lib/data/company";

function buildCompany(input: Partial<Company>): Company {
  return {
    id: input.id || "1",
    name: input.name || "Company",
    industryId: input.industryId || "1",
    industryName: input.industryName || "Industry",
    country: input.country || "KR",
    nameKr: input.nameKr,
    nameJp: input.nameJp,
    ticker: input.ticker,
    marketCap: input.marketCap,
    industryNameEn: input.industryNameEn,
    industryNameJp: input.industryNameJp,
  };
}

describe("compareCompaniesByMarketCapDesc", () => {
  it("sorts by market cap descending when both values exist", () => {
    const large = buildCompany({ id: "1", name: "Large", marketCap: 200 });
    const small = buildCompany({ id: "2", name: "Small", marketCap: 100 });

    const result = [small, large].sort(compareCompaniesByMarketCapDesc);
    expect(result.map((company) => company.id)).toEqual(["1", "2"]);
  });

  it("prioritizes companies with market cap over missing values", () => {
    const known = buildCompany({ id: "1", name: "Known", marketCap: 1 });
    const unknown = buildCompany({ id: "2", name: "Unknown" });

    const result = [unknown, known].sort(compareCompaniesByMarketCapDesc);
    expect(result.map((company) => company.id)).toEqual(["1", "2"]);
  });

  it("falls back to name sort when market cap is unavailable", () => {
    const alpha = buildCompany({ id: "1", name: "Alpha" });
    const beta = buildCompany({ id: "2", name: "Beta" });

    const result = [beta, alpha].sort(compareCompaniesByMarketCapDesc);
    expect(result.map((company) => company.id)).toEqual(["1", "2"]);
  });
});
