"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTheme, type ThemePreference } from "@/components/theme-provider";

export function ProfileForm({
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
}) {
  const { preference, setPreference } = useTheme();
  const fieldClass =
    "mt-1.5 h-11 w-full rounded-lg border bg-surface px-3 text-base leading-6 text-ink outline-none focus:border-primary focus:ring-3 focus:ring-primary/15";

  return (
    <div className="grid gap-6">
      <Card className="p-5 sm:p-6">
        <h3 className="text-lg font-bold">Personal details</h3>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            Name
            <input
              className={`${fieldClass} bg-surface-subtle text-muted`}
              value={userName}
              readOnly
            />
          </label>
          <label className="block text-sm font-semibold">
            Email
            <input
              className={`${fieldClass} bg-surface-subtle text-muted`}
              type="email"
              value={userEmail}
              readOnly
            />
          </label>
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <h3 className="text-lg font-bold">Appearance</h3>
        <p className="mt-2 type-body-sm text-muted">Choose a theme for this browser. System follows your device setting.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {([
            ["system", "System", Monitor],
            ["light", "Light", Sun],
            ["dark", "Dark", Moon],
          ] as const).map(([value, label, Icon]) => (
            <button
              key={value}
              type="button"
              onClick={() => setPreference(value as ThemePreference)}
              className={`flex items-center gap-3 rounded-lg border p-4 text-left text-sm font-semibold ${preference === value ? "border-primary bg-primary-soft text-primary" : "bg-surface hover:bg-surface-subtle"}`}
              aria-pressed={preference === value}
            >
              <Icon className="size-5" /> {label}
            </button>
          ))}
        </div>
      </Card>

    </div>
  );
}
