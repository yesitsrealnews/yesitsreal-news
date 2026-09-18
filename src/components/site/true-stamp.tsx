import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TrueStamp({
  children,
  tone = "signal",
  tilt = 0,
  className,
}: {
  children: ReactNode;
  tone?: "scream" | "signal" | "true" | "ink";
  tilt?: number;
  className?: string;
}) {
  const tones = {
    scream: "bg-scream text-scream-ink border-scream",
    signal: "bg-signal text-signal-fg border-signal",
    true: "bg-true text-true-fg border-true",
    ink: "bg-ink text-paper border-ink",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-none border px-2 py-0.5 font-sans text-[0.65rem] font-extrabold uppercase tracking-[0.16em]",
        tones[tone],
        className,
      )}
      style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
    >
      {children}
    </span>
  );
}
