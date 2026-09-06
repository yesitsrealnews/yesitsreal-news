import { useState } from "react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { cn } from "@/lib/utils";
import { absUrl, nativeShare, shareCopy } from "@/lib/viral";
import { useAppStore } from "@/lib/store";

export function ShareBar({
  lang,
  path,
  headline,
  className,
  onShare,
}: {
  lang: Lang;
  path: string;
  headline: string;
  className?: string;
  onShare?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const countShare = useAppStore((s) => s.countShare);
  const text = shareCopy(lang, headline, path);
  const abs = absUrl(path);
  const encoded = encodeURIComponent(text);
  const mark = () => {
    countShare(path);
    onShare?.();
  };
  const links = [
    { id: "x", label: "X", href: `https://x.com/intent/tweet?text=${encoded}` },
    { id: "wa", label: "WhatsApp", href: `https://api.whatsapp.com/send?text=${encoded}` },
    { id: "tg", label: "Telegram", href: `https://t.me/share/url?url=${encodeURIComponent(abs)}&text=${encodeURIComponent(headline)}` },
    { id: "fb", label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(abs)}` },
  ];

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="kicker text-ink-muted">{t(lang, "share")}</span>
      {links.map((l) => (
        <a
          key={l.id}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={mark}
          className="inline-flex h-11 items-center border border-rule bg-card px-3 text-[0.68rem] font-bold uppercase tracking-[0.12em] transition-transform duration-150 active:scale-95 hover:bg-ink hover:text-paper"
        >
          {l.label}
        </a>
      ))}
      <button
        type="button"
        className="inline-flex h-11 items-center border border-rule bg-scream px-3 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-scream-ink transition-transform duration-150 active:scale-95"
        onClick={() => {
          void navigator.clipboard?.writeText(text);
          setCopied(true);
          mark();
          window.setTimeout(() => setCopied(false), 1600);
        }}
      >
        {copied ? t(lang, "copied") : t(lang, "copyLink")}
      </button>
      <button
        type="button"
        className="inline-flex h-11 items-center border border-ink bg-ink px-3 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-paper"
        onClick={() => {
          void nativeShare({ title: headline, text, url: abs }).then((ok) => {
            if (ok) mark();
          });
        }}
      >
        {t(lang, "nativeShare")}
      </button>
    </div>
  );
}
