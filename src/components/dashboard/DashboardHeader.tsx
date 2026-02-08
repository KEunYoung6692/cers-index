import { useState } from 'react';
import { Check, ChevronsUpDown, Building2, Calendar, Sun, Moon, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Company } from '@/data/mockData';
import { type I18nStrings, type Language, LANGUAGES } from '@/lib/i18n';
import { getCompanySearchText, getDisplayCompanyName } from '@/lib/data/company';
import { getLocalizedIndustryName } from '@/lib/data/industry';

interface DashboardHeaderProps {
  companies: Company[];
  selectedCompanyId: string;
  selectedYear: number;
  selectedCountry: string;
  selectedLanguage: Language;
  strings: I18nStrings;
  onCompanyChange: (companyId: string) => void;
  onCountryChange: (country: string) => void;
  onLanguageChange: (language: Language) => void;
}

const availableCountries = ["KR", "JP"];

export function DashboardHeader({
  companies,
  selectedCompanyId,
  selectedYear,
  selectedCountry,
  selectedLanguage,
  strings,
  onCompanyChange,
  onCountryChange,
  onLanguageChange,
}: DashboardHeaderProps) {
  const [open, setOpen] = useState(false);
  const selectedCompany = companies.find(c => c.id === selectedCompanyId);
  const headerStrings = strings.header;
  const selectedCompanyName = getDisplayCompanyName(selectedCompany, headerStrings.companyPlaceholder);
  const { theme, resolvedTheme, setTheme } = useTheme();
  const isDark = (theme === 'dark') || (theme === 'system' && resolvedTheme === 'dark');

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-14 items-center justify-between gap-4">
        {/* Left: Selectors */}
        <div className="flex items-center gap-3">
          {/* Country Select */}
          <Select value={selectedCountry} onValueChange={onCountryChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableCountries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Company Autocomplete */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[280px] justify-between font-normal"
              >
                <div className="flex items-center gap-2 truncate">
                  <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                  {selectedCompanyName}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="start">
              <Command>
                <CommandInput placeholder={headerStrings.searchPlaceholder} />
                <CommandList>
                  <CommandEmpty>{headerStrings.noCompanyFound}</CommandEmpty>
                  <CommandGroup>
                    {companies.map((company) => {
                      const displayCompanyName = getDisplayCompanyName(company, headerStrings.companyPlaceholder);
                      const searchValue = getCompanySearchText(company) || displayCompanyName;
                      return (
                        <CommandItem
                          key={company.id}
                          value={searchValue}
                          onSelect={() => {
                            onCompanyChange(company.id);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCompanyId === company.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span>{displayCompanyName}</span>
                            <span className="text-xs text-muted-foreground">
                              {getLocalizedIndustryName(company, selectedLanguage, company.industryName)}
                            </span>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Fixed Year */}
          <div
            className="flex h-10 w-[120px] items-center gap-2 rounded-md border border-input bg-background px-3 text-sm"
            aria-label="Selected year"
          >
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{selectedYear}</span>
          </div>

        </div>

        {/* Right: Language + Theme */}
        <div className="flex items-center gap-2">
          <Select value={selectedLanguage} onValueChange={(value) => onLanguageChange(value as Language)}>
            <SelectTrigger className="w-[170px]">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{headerStrings.language}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-sm font-medium">{selectedLanguage}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((language) => (
                <SelectItem key={language} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
