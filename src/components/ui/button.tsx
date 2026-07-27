import Link from "next/link";
import {
  type ButtonHTMLAttributes,
  type ComponentProps,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-primary text-white shadow-sm hover:bg-primary-hover active:bg-primary-active",
  secondary:
    "border border-[#cfd8d1] bg-white text-ink hover:border-[#8fa394] hover:bg-[#f7faf8]",
  ghost: "text-muted hover:bg-[#edf2ee] hover:text-ink",
  danger:
    "border border-red-200 bg-white text-red-700 hover:bg-red-50",
};

const sizes = {
  sm: "h-10 px-3.5 text-sm leading-5",
  md: "h-11 px-4 text-sm leading-5",
  lg: "h-12 px-5 text-base leading-6",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ComponentProps<typeof Link> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  children: ReactNode;
}) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
