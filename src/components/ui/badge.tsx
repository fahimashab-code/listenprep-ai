import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variants = {
  green: "border-primary/25 bg-primary-soft text-primary-strong",
  gray: "border-border bg-surface-subtle text-muted",
  amber: "border-warning-border bg-warning-soft text-warning",
  red: "border-danger-border bg-danger-soft text-danger",
};

export function Badge({
  className,
  variant = "gray",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  variant?: keyof typeof variants;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[0.8125rem] font-semibold leading-4",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
