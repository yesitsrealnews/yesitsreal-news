import { useMemo, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, Languages } from "lucide-react";
import { LANGS } from "@/lib/i18n/langs";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({
  lang,
  onChange,
}: {
  lang: Lang;
  onChange: (lang: Lang) => void;
}) {
  const [q, setQ] = useState("");
  const current = LANGS.find((l) => l.code === lang);
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return LANGS;
    return LANGS.filter(
      (l) =>
        l.native.toLowerCase().includes(needle) ||
        l.name.toLowerCase().includes(needle) ||
        l.code.toLowerCase().includes(needle),
    );
  }, [q]);

  return (
    <DropdownMenu.Root onOpenChange={() => setQ("")}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="inline-flex h-11 min-w-11 items-center gap-1.5 px-2 text-xs font-medium uppercase tracking-[0.12em] text-ink hover:bg-paper-2"
          aria-label={t(lang, "language")}
        >
          <Languages className="size-4" />
          <span className="hidden sm:inline">{current?.code === "zh-TW" ? "繁" : current?.code.toUpperCase()}</span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="z-50 max-h-[min(70vh,28rem)] w-72 overflow-hidden border border-rule bg-paper text-ink shadow-lg"
        >
          <div className="border-b border-rule p-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t(lang, "language")}
              className="h-10 w-full border border-rule bg-card px-2 text-sm"
            />
          </div>
          <div className="max-h-80 overflow-y-auto py-1">
            {filtered.map((l) => (
              <DropdownMenu.Item
                key={l.code}
                onSelect={() => onChange(l.code)}
                className={cn(
                  "flex cursor-pointer items-center justify-between px-3 py-2 text-sm outline-none data-[highlighted]:bg-paper-2",
                  l.code === lang && "bg-paper-2",
                )}
              >
                <span className="flex flex-col">
                  <span className="font-medium">{l.native}</span>
                  <span className="text-xs text-ink-muted">{l.name}</span>
                </span>
                {l.code === lang ? <Check className="size-4 text-signal" /> : null}
              </DropdownMenu.Item>
            ))}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
