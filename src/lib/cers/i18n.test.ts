import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  getIntlLocale,
  getTranslations,
  isSupportedLocale,
  localizedPath,
  SUPPORTED_LOCALES,
  stripLocalePrefix,
  detectLocaleFromPathname,
} from "./i18n";

const EXPECTED_LOCALES = ["ko", "en", "zh", "ja", "vi", "ru", "id", "th", "bn", "es"] as const;

describe("CERs locale contract", () => {
  it("supports the ten requested locales in the configured order", () => {
    expect(SUPPORTED_LOCALES).toEqual(EXPECTED_LOCALES);
    expect(DEFAULT_LOCALE).toBe("en");
    for (const locale of EXPECTED_LOCALES) {
      expect(isSupportedLocale(locale)).toBe(true);
      expect(getTranslations(locale).localeName).not.toBe("");
      expect(getIntlLocale(locale)).toMatch(new RegExp(`^${locale}-`, "i"));
    }
  });

  it.each(EXPECTED_LOCALES)("builds and detects localized paths for %s", (locale) => {
    const path = localizedPath(locale, "/companies?q=energy");
    const pathname = path.split("?")[0] ?? "/";

    if (locale === "en") {
      expect(path).toBe("/companies?q=energy");
      expect(detectLocaleFromPathname(pathname)).toBe("en");
    } else {
      expect(path).toBe(`/${locale}/companies?q=energy`);
      expect(detectLocaleFromPathname(pathname)).toBe(locale);
    }
    expect(stripLocalePrefix(pathname)).toBe("/companies");
  });

  it("normalizes an explicit English prefix for shared route matching", () => {
    expect(stripLocalePrefix("/en/industries")).toBe("/industries");
    expect(detectLocaleFromPathname("/en/industries")).toBe("en");
  });
});
