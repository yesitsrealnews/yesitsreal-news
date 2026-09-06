import type { Lang } from "@/lib/types";
import type { UiKey } from "@/lib/i18n/keys";
import { DICT } from "./dict";

export function t(lang: Lang, key: UiKey): string {
  return DICT[lang]?.[key] ?? DICT.en[key] ?? key;
}

export { DICT };
