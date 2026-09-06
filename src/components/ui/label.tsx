import * as React from "react";
import { cn } from "@/lib/utils";

export const Label = React.forwardRef<HTMLLabelElement, React.ComponentProps<"label">>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("block text-xs font-medium uppercase tracking-[0.12em] text-ink-muted", className)}
      {...props}
    />
  ),
);
Label.displayName = "Label";
