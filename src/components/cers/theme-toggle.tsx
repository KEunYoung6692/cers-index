"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getTranslations, type SupportedLocale } from "@/lib/cers/i18n";

type ThemeToggleProps = {
  locale?: SupportedLocale;
};

export function ThemeToggle({ locale = "en" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const t = getTranslations(locale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const label = isDark ? t.header.lightMode : t.header.darkMode;

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="h-9 rounded-full border-slate-200 bg-slate-50 px-3 text-slate-700 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
      aria-label={`${t.header.themeLabel}: ${label}`}
      title={`${t.header.themeLabel}: ${label}`}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}
