import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

export function SheetContent({
  className,
  children,
  side = "right",
}: {
  className?: string;
  children: React.ReactNode;
  side?: "left" | "right";
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40 data-[state=open]:animate-in" />
      <Dialog.Content
        className={cn(
          "fixed top-0 z-50 flex h-full w-[min(100%,24rem)] flex-col bg-paper text-ink shadow-xl",
          "focus:outline-none",
          side === "right" ? "right-0" : "left-0",
          className,
        )}
      >
        {children}
        <Dialog.Close className="absolute top-3 right-3 inline-flex size-11 items-center justify-center text-ink">
          <X className="size-5" />
          <span className="sr-only">Close</span>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("border-b border-rule px-5 py-4", className)} {...props} />;
}

export function SheetTitle({ className, ...props }: React.ComponentProps<typeof Dialog.Title>) {
  return <Dialog.Title className={cn("font-serif text-xl", className)} {...props} />;
}
