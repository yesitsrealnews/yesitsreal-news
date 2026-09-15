import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TrueStamp({
  children,
  tone = "scream",
  tilt = -7,
  className,
}: {
  children: ReactNode;
  tone?: "scream" | "signal" | "true" | "ink";
  tilt?: number;
  className?: string;
}) {
  const tones = {
    scream: "bg-scream text-scream-ink",
    signal: "bg-signal text-signal-fg",
    true: "bg-true text-true-fg",
    ink: "bg-ink text-paper",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border-2 border-ink px-2 py-0.5 font-sans text-[0.65rem] font-extrabold uppercase tracking-[0.14em] shadow-[3px_3px_0_0_var(--color-ink)]",
        tones[tone],
        className,
      )}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      {children}
    </span>
  );
}
