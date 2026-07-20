"use client";

import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type MultiSelectOption = {
  value: string;
  label: string;
};

type MultiSelectDropdownProps = {
  allLabel: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  ariaLabel?: string;
  triggerClassName?: string;
  contentClassName?: string;
  align?: "start" | "center" | "end";
  searchPlaceholder?: string;
  applyLabel?: string;
  resetLabel?: string;
  multipleSelectionLabel?: (count: number) => string;
};

function getSelectionLabel(allLabel: string, options: MultiSelectOption[], selectedValues: string[], multipleSelectionLabel?: (count: number) => string) {
  if (selectedValues.length === 0) {
    return allLabel;
  }

  const selectedOptions = selectedValues
    .map((value) => options.find((option) => option.value === value))
    .filter((option): option is MultiSelectOption => Boolean(option));

  if (selectedOptions.length === 0) {
    return allLabel;
  }

  if (selectedOptions.length === 1) {
    return selectedOptions[0].label;
  }

  return multipleSelectionLabel?.(selectedOptions.length) ?? `${selectedOptions[0].label} +${selectedOptions.length - 1}`;
}

export function MultiSelectDropdown({
  allLabel,
  options,
  selectedValues,
  onChange,
  ariaLabel,
  triggerClassName,
  contentClassName,
  align = "start",
  searchPlaceholder,
  applyLabel,
  resetLabel,
  multipleSelectionLabel,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftValues, setDraftValues] = useState(selectedValues);
  const [query, setQuery] = useState("");
  const staged = Boolean(applyLabel);
  const activeValues = staged ? draftValues : selectedValues;
  const toggleValue = (value: string) => {
    if (activeValues.includes(value)) {
      const next = activeValues.filter((selectedValue) => selectedValue !== value);
      if (staged) setDraftValues(next);
      else onChange(next);
      return;
    }

    const next = [...activeValues, value];
    if (staged) setDraftValues(next);
    else onChange(next);
  };

  const summaryLabel = getSelectionLabel(allLabel, options, selectedValues, multipleSelectionLabel);
  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <DropdownMenu
      modal={false}
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) {
          setDraftValues(selectedValues);
          setQuery("");
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          className={cn(
            "flex h-11 w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-left text-sm text-slate-900 outline-none transition focus-visible:border-teal-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus-visible:border-teal-500",
            triggerClassName,
          )}
        >
          <span className="truncate">{summaryLabel}</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={align}
        sideOffset={8}
        className={cn("max-h-[320px] w-72 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border-slate-200 p-2 dark:border-slate-700", contentClassName)}
      >
        {searchPlaceholder && (
          <div className="relative mb-2 px-1" onKeyDown={(event) => event.stopPropagation()}>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>
        )}
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            if (staged) setDraftValues([]);
            else onChange([]);
          }}
          className="gap-3 rounded-xl px-3 py-2.5"
        >
          <Checkbox
            checked={activeValues.length === 0}
            className="pointer-events-none border-slate-300 data-[state=checked]:border-teal-600 data-[state=checked]:bg-teal-600 data-[state=checked]:text-white dark:border-slate-600"
          />
          <span className="truncate">{allLabel}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="mx-0 my-2" />

        {filteredOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={(event) => {
              event.preventDefault();
              toggleValue(option.value);
            }}
            className="gap-3 rounded-xl px-3 py-2.5"
          >
            <Checkbox
              checked={activeValues.includes(option.value)}
              className="pointer-events-none border-slate-300 data-[state=checked]:border-teal-600 data-[state=checked]:bg-teal-600 data-[state=checked]:text-white dark:border-slate-600"
            />
            <span className="truncate">{option.label}</span>
          </DropdownMenuItem>
        ))}
        {staged && (
          <>
            <DropdownMenuSeparator className="mx-0 my-2" />
            <div className="flex items-center justify-between gap-2 px-1 py-1">
              <button type="button" onClick={() => setDraftValues([])} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">{resetLabel}</button>
              <button type="button" onClick={() => { onChange(draftValues); setIsOpen(false); }} className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">{applyLabel}</button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
