import Link from "next/link";
import { Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

export function Brand({
  compact = false,
  href = "/",
  className,
}: {
  compact?: boolean;
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 font-bold tracking-tight text-[#17201a]",
        className,
      )}
      aria-label="Listenly home"
    >
      <span className="grid size-9 place-items-center rounded-lg bg-[#176b3a] text-white">
        <Headphones className="size-5" aria-hidden="true" />
      </span>
      {!compact && <span className="text-xl">Listenly</span>}
    </Link>
  );
}
