import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-sans text-sm font-extrabold uppercase tracking-[0.08em] transition-[transform,box-shadow,opacity] duration-[var(--motion-quick,150ms)] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
  {
    variants: {
      variant: {
        default:
          "border-2 border-ink bg-ink text-paper shadow-[3px_3px_0_0_var(--color-signal)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_var(--color-signal)]",
        signal:
          "border-2 border-ink bg-signal text-signal-fg shadow-[3px_3px_0_0_var(--color-ink)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_var(--color-ink)]",
        pop:
          "border-2 border-ink bg-scream text-scream-ink shadow-[3px_3px_0_0_var(--color-ink)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_var(--color-ink)]",
        outline:
          "border-2 border-ink bg-card text-ink shadow-[3px_3px_0_0_var(--color-ink)] hover:bg-scream",
        ghost: "text-ink hover:bg-scream/60 rounded-full",
        gold:
          "border-2 border-ink bg-gold text-ink shadow-[3px_3px_0_0_var(--color-ink)] hover:translate-x-px hover:translate-y-px",
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
