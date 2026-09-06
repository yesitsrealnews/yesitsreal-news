import { cn } from "@/lib/utils";

export function Separator({ className, strong }: { className?: string; strong?: boolean }) {
  return (
    <hr
      className={cn(
        "border-0",
        strong ? "h-px bg-rule-strong" : "h-px bg-rule",
        className,
      )}
    />
  );
}
