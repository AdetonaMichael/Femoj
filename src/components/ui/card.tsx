"use client";

import * as React from "react";
import { cn } from "@/utils";

/* ─── Card ────────────────────────────────────────────────────────────────── */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-[#e8eaed] bg-white transition-shadow hover:shadow-[0_1px_6px_rgba(32,33,36,.18)]",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

/* ─── CardHeader ──────────────────────────────────────────────────────────── */
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-0.5 px-5 py-4 border-b border-[#e8eaed]",
        className
      )}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

/* ─── CardTitle ───────────────────────────────────────────────────────────── */
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-sm font-medium text-[#202124] leading-snug",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

/* ─── CardDescription ─────────────────────────────────────────────────────── */
interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-[#5f6368] mt-0.5", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/* ─── CardContent ─────────────────────────────────────────────────────────── */
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-5 py-4", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

/* ─── CardFooter ──────────────────────────────────────────────────────────── */
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center px-5 py-4 border-t border-[#e8eaed]",
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

/* ─── Exports ─────────────────────────────────────────────────────────────── */
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};