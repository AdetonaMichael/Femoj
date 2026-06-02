"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white hover:bg-primary/90 active:bg-primary/80",
        secondary:
          "bg-secondary text-white hover:bg-secondary/90 active:bg-secondary/80",
        outline:
          "border border-input bg-background hover:bg-muted active:bg-muted/80",
        ghost:
          "hover:bg-muted active:bg-muted/80 text-foreground",
        danger:
          "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
        success:
          "bg-green-600 text-white hover:bg-green-700 active:bg-green-800",
        warning:
          "bg-yellow-600 text-white hover:bg-yellow-700 active:bg-yellow-800",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        xs: "px-2 py-1 text-xs h-8",
        sm: "px-3 py-1.5 text-sm h-9",
        md: "px-4 py-2 text-base h-10",
        lg: "px-6 py-3 text-lg h-12",
        xl: "px-8 py-4 text-xl h-14",
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-8 w-8 p-0",
        "icon-lg": "h-12 w-12 p-0",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, fullWidth }),
          className
        )}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="spinner-border inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
