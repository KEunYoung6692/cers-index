"use client";

import { ChevronDown } from "lucide-react";
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
};

function getSelectionLabel(allLabel: string, options: MultiSelectOption[], selectedValues: string[]) {
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

  return `${selectedOptions[0].label} +${selectedOptions.length - 1}`;
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
}: MultiSelectDropdownProps) {
  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((selectedValue) => selectedValue !== value));
      return;
    }

    onChange([...selectedValues, value]);
  };

  const summaryLabel = getSelectionLabel(allLabel, options, selectedValues);

  return (
    <DropdownMenu modal={false}>
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
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            onChange([]);
          }}
          className="gap-3 rounded-xl px-3 py-2.5"
        >
          <Checkbox
            checked={selectedValues.length === 0}
            className="pointer-events-none border-slate-300 data-[state=checked]:border-teal-600 data-[state=checked]:bg-teal-600 data-[state=checked]:text-white dark:border-slate-600"
          />
          <span className="truncate">{allLabel}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="mx-0 my-2" />

        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={(event) => {
              event.preventDefault();
              toggleValue(option.value);
            }}
            className="gap-3 rounded-xl px-3 py-2.5"
          >
            <Checkbox
              checked={selectedValues.includes(option.value)}
              className="pointer-events-none border-slate-300 data-[state=checked]:border-teal-600 data-[state=checked]:bg-teal-600 data-[state=checked]:text-white dark:border-slate-600"
            />
            <span className="truncate">{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
