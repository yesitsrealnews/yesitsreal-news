import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      suppressHydrationWarning
      className={cn(
        "flex h-11 w-full border border-rule bg-card px-3 text-sm text-ink placeholder:text-ink-faint",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
