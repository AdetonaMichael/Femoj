"use client";

import React from "react";
import * as RadioGroup from "@radix-ui/react-checkbox";
import { cn } from "@/utils";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ onCheckedChange, className, indeterminate, ...props }, ref) => {
    return (
      <RadioGroup.Root
        checked={indeterminate ? "indeterminate" : props.checked ? true : false}
        onCheckedChange={onCheckedChange}
        className={cn(
          "peer h-4 w-4 shrink-0 border border-primary rounded-sm bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        <RadioGroup.Indicator className="flex items-center justify-center text-current">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
          </svg>
        </RadioGroup.Indicator>
      </RadioGroup.Root>
    );
  }
);

Checkbox.displayName = "Checkbox";
