"use client";

import { Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ProfileForm({
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
}) {
  const [saved, setSaved] = useState(false);
  const fieldClass =
    "mt-1.5 h-11 w-full rounded-lg border bg-white px-3 text-base leading-6 outline-none focus:border-primary focus:ring-3 focus:ring-green-100";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
        localStorage.setItem("listenly-profile-saved", "true");
        setTimeout(() => setSaved(false), 2500);
      }}
      className="grid gap-6 lg:grid-cols-[1fr_300px]"
    >
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
          <label className="block text-sm font-semibold">
            Target Listening Band
            <select className={fieldClass} defaultValue="8.0">
              {["6.0", "6.5", "7.0", "7.5", "8.0", "8.5", "9.0"].map(
                (value) => (
                  <option key={value}>{value}</option>
                ),
              )}
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Exam date <span className="font-normal text-subtle">(optional)</span>
            <input className={fieldClass} type="date" defaultValue="2026-10-17" />
          </label>
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <h3 className="text-lg font-bold">Practice preference</h3>
        <p className="mt-2 type-body-sm text-muted">
          Used to tailor your dashboard recommendation.
        </p>
        <div className="mt-5 space-y-3">
          {["Full Tests", "Short Practice"].map((label, index) => (
            <label
              key={label}
              className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm font-semibold"
            >
              <input
                type="radio"
                name="preference"
                defaultChecked={index === 0}
                className="accent-primary"
              />
              {label}
            </label>
          ))}
        </div>
      </Card>
      <div className="flex items-center gap-4 lg:col-span-2">
        <Button size="lg">
          <Save className="size-4" /> Save profile
        </Button>
        {saved && (
          <span className="text-sm font-semibold text-primary">
            Profile saved
          </span>
        )}
      </div>
    </form>
  );
}
