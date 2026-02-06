"use client";

import * as React from "react";
import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  label: string;
  children: React.ReactNode;
  contentClassName?: string;
  buttonClassName?: string;
}

export function InfoTooltip({ label, children, contentClassName, buttonClassName }: InfoTooltipProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className={cn(
            "inline-flex h-4 w-4 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            buttonClassName,
          )}
        >
          <Info className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-auto max-w-xs p-2 text-xs leading-relaxed",
          contentClassName,
        )}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}
