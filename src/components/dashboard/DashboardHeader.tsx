import { useState } from 'react';
import { Check, ChevronsUpDown, Building2, Calendar, ToggleLeft, ToggleRight, Sun, Moon } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import type { Company, Report } from '@/data/mockData';

interface DashboardHeaderProps {
  companies: Company[];
  selectedCompanyId: string;
  selectedYear: number;
  includeSubCompany: boolean;
  selectedCountry: string;
  report?: Report;
  dataMix: { verified: number; self: number; proxy: number };
  onCompanyChange: (companyId: string) => void;
  onYearChange: (year: number) => void;
  onCountryChange: (country: string) => void;
  onSubCompanyToggle: (include: boolean) => void;
}

const availableYears = [2024, 2023, 2022, 2021];
const availableCountries = ["KR", "JP"];

export function DashboardHeader({
  companies,
  selectedCompanyId,
  selectedYear,
  includeSubCompany,
  selectedCountry,
  report,
  dataMix,
  onCompanyChange,
  onYearChange,
  onCountryChange,
  onSubCompanyToggle,
}: DashboardHeaderProps) {
  const [open, setOpen] = useState(false);
  const selectedCompany = companies.find(c => c.id === selectedCompanyId);
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
                  {selectedCompany ? selectedCompany.name : "Select company..."}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search company..." />
                <CommandList>
                  <CommandEmpty>No company found.</CommandEmpty>
                  <CommandGroup>
                    {companies.map((company) => (
                      <CommandItem
                        key={company.id}
                        value={company.name}
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
                          <span>{company.name}</span>
                          <span className="text-xs text-muted-foreground">{company.industryName}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Year Select */}
          <Select value={selectedYear.toString()} onValueChange={(v) => onYearChange(parseInt(v))}>
            <SelectTrigger className="w-[120px]">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sub-company Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSubCompanyToggle(!includeSubCompany)}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            {includeSubCompany ? (
              <ToggleRight className="h-5 w-5 text-accent" />
            ) : (
              <ToggleLeft className="h-5 w-5" />
            )}
            <span className="text-xs">Sub-entities</span>
          </Button>
        </div>

        {/* Right: Meta Badges */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono text-xs">
            S1+S2
          </Badge>
          <Badge variant="outline" className="text-xs">
            <span className="text-score-good">{dataMix.verified}%</span>
            <span className="mx-1 text-muted-foreground">/</span>
            <span>{dataMix.self}%</span>
            <span className="mx-1 text-muted-foreground">/</span>
            <span className="text-muted-foreground">{dataMix.proxy}%</span>
          </Badge>
          {report && (
            <Badge variant="outline" className="text-xs font-normal">
              FY{report.reportYear} · {new Date(report.publicationDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </Badge>
          )}
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
