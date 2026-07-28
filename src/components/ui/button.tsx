import Link from "next/link";
import {
  type ButtonHTMLAttributes,
  type ComponentProps,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-primary text-white shadow-[0_5px_14px_rgba(23,107,58,.18)] hover:-translate-y-px hover:bg-primary-hover hover:shadow-[0_7px_18px_rgba(23,107,58,.22)] active:translate-y-0 active:bg-primary-active",
  secondary:
    "border border-[#cfd8d1] bg-white text-ink shadow-sm hover:-translate-y-px hover:border-[#8fa394] hover:bg-[#f7faf8] hover:shadow-md active:translate-y-0",
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
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-[color,background-color,border-color,box-shadow,transform] disabled:pointer-events-none disabled:opacity-50",
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
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-[color,background-color,border-color,box-shadow,transform]",
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
