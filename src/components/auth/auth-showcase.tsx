import {
  AudioLines,
  Check,
  Clock3,
  Headphones,
  ShieldCheck,
} from "lucide-react";

const parts = ["Part 1", "Part 2", "Part 3", "Part 4"];

export function AuthShowcase() {
  return (
    <aside className="auth-showcase relative hidden min-h-screen overflow-hidden lg:flex lg:flex-col lg:justify-between">
      <div
        className="pointer-events-none absolute inset-0 opacity-45"
        aria-hidden="true"
      >
        <div className="absolute -right-24 -top-28 size-[380px] rounded-full border border-white/15" />
        <div className="absolute -right-10 -top-12 size-[260px] rounded-full border border-white/10" />
        <div className="absolute -bottom-36 -left-24 size-[430px] rounded-full border border-white/10" />
      </div>

      <div className="relative z-10 max-w-xl px-10 pt-12 xl:px-16 xl:pt-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur">
          <ShieldCheck className="size-4 text-[#a9dfb8]" aria-hidden="true" />
          Structured IELTS Listening practice
        </div>
        <h2 className="mt-6 max-w-lg text-[2.35rem] font-bold leading-[1.12] tracking-[-0.045em] text-white xl:text-[2.8rem]">
          Build confidence across all four parts.
        </h2>
        <p className="mt-4 max-w-lg text-base leading-7 text-white/72">
          Complete realistic listening mocks, review every answer, and focus
          your next practice session where it matters most.
        </p>
      </div>

      <div className="relative z-10 mx-10 my-10 max-w-xl xl:mx-16">
        <div className="rounded-[1.75rem] border border-white/15 bg-white/[0.09] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.22)] backdrop-blur-md xl:p-5">
          <div className="rounded-[1.35rem] bg-surface p-5 text-ink shadow-xl xl:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  Full mock structure
                </p>
                <p className="mt-1 text-lg font-bold">4 parts · 40 questions</p>
              </div>
              <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-contrast shadow-[0_8px_20px_rgba(23,107,58,0.24)]">
                <Headphones className="size-5" aria-hidden="true" />
              </span>
            </div>

            <div className="mt-6 grid grid-cols-4 gap-2">
              {parts.map((part) => (
                <div key={part} className="rounded-lg bg-primary-soft px-2 py-2 text-center">
                  <p className="text-[11px] font-semibold text-primary">{part}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-4 rounded-xl border bg-surface-subtle p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                <AudioLines className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex h-7 items-center gap-1" aria-hidden="true">
                  {[10, 18, 13, 24, 17, 28, 14, 21, 11, 26, 17, 23].map(
                    (height, index) => (
                      <span
                        key={`${height}-${index}`}
                        className="w-1.5 rounded-full bg-[#69a97b]"
                        style={{ height }}
                      />
                    ),
                  )}
                </div>
                <p className="mt-1 text-xs font-semibold text-muted">
                  Clear part and question position
                </p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-muted">
                <Clock3 className="size-4" aria-hidden="true" />
                30 min
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-primary-soft px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-semibold text-primary-strong">
                <span className="grid size-5 place-items-center rounded-full bg-primary text-primary-contrast">
                  <Check className="size-3" aria-hidden="true" />
                </span>
                Progress saved automatically
              </span>
              <span className="text-sm font-bold text-primary">Resume safely</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-5 px-10 pb-10 text-xs font-semibold text-white/60 xl:px-16">
        <span>4 Parts</span>
        <span className="size-1 rounded-full bg-white/35" />
        <span>40 Questions</span>
        <span className="size-1 rounded-full bg-white/35" />
        <span>Focused review</span>
      </div>
    </aside>
  );
}
