import { TrueStamp } from "@/components/site/true-stamp";
import { SITE_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** Masthead mark: YES IT'S REAL + NEWS. Same in every language. */
export function MastheadLogo({
  className,
  wordmarkClassName,
  stampClassName,
}: {
  className?: string;
  wordmarkClassName?: string;
  stampClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)} aria-label={SITE_NAME}>
      <span className={cn("masthead-wordmark", wordmarkClassName)}>YES IT'S REAL</span>
      <TrueStamp className={stampClassName}>NEWS</TrueStamp>
    </span>
  );
}
