import { describe, expect, it } from "vitest";
import { __testing__ } from "@/lib/server/market-cap";

describe("market-cap helpers", () => {
  it("normalizes KR csv code from decimal-like values", () => {
    expect(__testing__.normalizeCsvCode("6840.0", "KR")).toBe("006840");
    expect(__testing__.normalizeCsvCode("78930.0", "KR")).toBe("078930");
  });

  it("normalizes JP csv code by removing trailing exchange digit", () => {
    expect(__testing__.normalizeCsvCode("72030", "JP")).toBe("7203");
    expect(__testing__.normalizeCsvCode("7203", "JP")).toBe("7203");
  });

  it("infers symbols from ticker and country", () => {
    expect(__testing__.inferSymbolFromTicker("5930", "KR")).toBe("005930.KS");
    expect(__testing__.inferSymbolFromTicker("7203", "JP")).toBe("7203.T");
    expect(__testing__.inferSymbolFromTicker("005930.KS", "KR")).toBe("005930.KS");
  });

  it("parses csv lines with quoted commas", () => {
    const parsed = __testing__.parseCsvLine('1,"A, Inc.",KR,,6840.0,006840');
    expect(parsed).toEqual(["1", "A, Inc.", "KR", "", "6840.0", "006840"]);
  });
});
