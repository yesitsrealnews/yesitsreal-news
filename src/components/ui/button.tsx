import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none font-sans text-sm font-extrabold uppercase tracking-[0.12em] transition-[background-color,color,opacity,border-color] duration-[var(--motion-quick,150ms)] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
  {
    variants: {
      variant: {
        default: "border border-ink bg-ink text-paper hover:bg-signal hover:border-signal hover:text-signal-fg",
        signal: "border border-signal bg-signal text-signal-fg hover:bg-ink hover:border-ink hover:text-paper",
        pop: "border border-scream bg-scream text-scream-ink hover:bg-signal hover:border-signal hover:text-signal-fg",
        outline: "border border-rule bg-transparent text-ink hover:border-ink",
        ghost: "text-ink hover:bg-paper-2 rounded-none",
        gold: "border border-gold bg-gold text-ink hover:bg-scream",
        link: "text-ink underline-offset-4 hover:underline px-0 tracking-normal font-semibold normal-case",
      },
      size: {
        default: "h-11 px-4",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-5",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { buttonVariants };
