import type { ReactNode } from "react";
import type { Lang } from "@/lib/types";

/** Articles are free to read. Gate retired 7 Sept 2026. */
export function useArticleUnlocked() {
  return true;
}

export function ReadGate({ children }: { lang?: Lang; children: ReactNode }) {
  return <>{children}</>;
}
