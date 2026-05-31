"use client";

import * as React from "react";
import { cn } from "@/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-3",
};

export function Spinner({ className, size = "md", ...props }: SpinnerProps) {
  return (
    <div
      className={cn(
        "border border-muted border-t-primary rounded-full animate-spin",
        sizeMap[size],
        className
      )}
      {...props}
    />
  );
}

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "danger" | "warning" | "info";
  title?: string;
  description?: string;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "default",
      title,
      description,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700",
      success: "bg-green-50 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700",
      danger: "bg-red-50 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700",
      warning: "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700",
      info: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border p-4",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {title && <h4 className="font-semibold mb-2">{title}</h4>}
        {description && <p className="text-sm mb-2">{description}</p>}
        {children}
      </div>
    );
  }
);

Alert.displayName = "Alert";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8 ",
        className
      )}
      {...props}
    />
  )
);

Container.displayName = "Container";
