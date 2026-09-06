import type { ReactNode } from "react";
import { SiteShell } from "@/components/site/site-shell";
import { t } from "@/lib/i18n";
import type { UiKey } from "@/lib/i18n/keys";
import { useAppStore } from "@/lib/store";

export function LegalPage({
  titleKey,
  children,
}: {
  titleKey: UiKey;
  children: ReactNode;
}) {
  const lang = useAppStore((s) => s.lang);
  const title = t(lang, titleKey);
  return (
    <SiteShell>
      <main id="main" className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="font-serif text-4xl">{title}</h1>
        <div className="article-serif mt-6 space-y-4 text-[1.05rem] text-ink">{children}</div>
      </main>
    </SiteShell>
  );
}
