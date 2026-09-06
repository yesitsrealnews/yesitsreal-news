import { useEffect, useState } from "react";
import { formatCount, liveReaders } from "@/lib/engagement";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

export function LiveStats({ lang }: { lang: Lang }) {
  const [n, setN] = useState(() => liveReaders());
  useEffect(() => {
    const tick = () => setN(liveReaders(Date.now()) + Math.floor((Date.now() / 8_000) % 90));
    tick();
    const id = window.setInterval(tick, 8000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <p className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em]">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-signal" />
      </span>
      {formatCount(n, lang)} {t(lang, "readersNow")}
    </p>
  );
}
