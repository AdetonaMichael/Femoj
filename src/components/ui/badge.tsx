"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

/* ─── Variants ────────────────────────────────────────────────────────────── */
const badgeVariants = cva(
  // Base: inline chip — no rounded-full, no bold, tight padding
  "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium leading-none select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#e8f0fe] text-[#1a73e8]",
        secondary:
          "bg-[#f1f3f4] text-[#5f6368]",
        success:
          "bg-[#e6f4ea] text-[#137333]",
        danger:
          "bg-[#fce8e6] text-[#c5221f]",
        warning:
          "bg-[#fef7e0] text-[#b06000]",
        info:
          "bg-[#e8f0fe] text-[#1a73e8]",
        outline:
          "border border-[#dadce0] bg-transparent text-[#5f6368]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/* ─── Props ───────────────────────────────────────────────────────────────── */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

/* ─── Component ───────────────────────────────────────────────────────────── */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };