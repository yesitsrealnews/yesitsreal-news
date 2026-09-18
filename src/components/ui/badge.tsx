import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "ink",
  children,
}: {
  className?: string;
  tone?: "ink" | "signal" | "gold" | "true" | "muted" | "ad" | "scream";
  children: ReactNode;
}) {
  const tones = {
    ink: "bg-ink text-paper",
    signal: "bg-signal text-signal-fg",
    gold: "bg-gold text-ink",
    true: "bg-true text-true-fg",
    muted: "border-2 border-ink text-ink bg-card",
    ad: "bg-ad text-ad-ink",
    scream: "bg-scream text-scream-ink",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-none border border-rule px-1.5 py-0.5 font-sans text-[0.625rem] font-extrabold uppercase tracking-[0.16em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
