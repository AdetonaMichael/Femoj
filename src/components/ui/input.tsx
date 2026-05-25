"use client";

import * as React from "react";
import { cn } from "@/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      error,
      label,
      helperText,
      startIcon,
      endIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {startIcon && (
            <div className="absolute left-3 text-muted-foreground pointer-events-none">
              {startIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "input-base",
              startIcon && "pl-10",
              endIcon && "pr-10",
              error && "border-red-500 focus:ring-red-500",
              disabled && "opacity-50 cursor-not-allowed",
              className
            )}
            disabled={disabled}
            ref={ref}
            {...props}
          />
          {endIcon && (
            <div className="absolute right-3 text-muted-foreground pointer-events-none">
              {endIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
