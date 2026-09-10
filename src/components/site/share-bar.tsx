import { useState } from "react";
import { Copy, Share2 } from "lucide-react";
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
    {
      id: "wa",
      label: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encoded}`,
      className: "bg-[#25D366] text-white",
    },
    {
      id: "x",
      label: "X",
      href: `https://x.com/intent/tweet?text=${encoded}`,
      className: "bg-black text-white",
    },
    {
      id: "fb",
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(abs)}`,
      className: "bg-[#1877F2] text-white",
    },
    {
      id: "messenger",
      label: "Messenger",
      // Facebook Send Dialog (opens Messenger on mobile / friend picker on desktop).
      // App id 966242223397117 is the public share-dialog id used when a site has no Meta app.
      href: `https://www.facebook.com/dialog/send?link=${encodeURIComponent(abs)}&app_id=966242223397117&redirect_uri=${encodeURIComponent(abs)}`,
      className: "bg-[#0084FF] text-white",
    },
    {
      id: "tg",
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodeURIComponent(abs)}&text=${encodeURIComponent(headline)}`,
      className: "bg-[#229ED9] text-white",
    },
  ];

  return (
    <div className={cn("w-full", className)}>
      <p className="kicker text-signal">{t(lang, "share")}</p>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {links.map((l) => (
          <a
            key={l.id}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={mark}
            className={cn(
              "inline-flex h-14 items-center justify-center px-3 text-sm font-extrabold uppercase tracking-[0.08em] active:scale-[0.98]",
              l.className,
            )}
          >
            {l.label}
          </a>
        ))}
        <button
          type="button"
          className="inline-flex h-14 items-center justify-center gap-2 bg-scream px-3 text-sm font-extrabold uppercase tracking-[0.08em] text-scream-ink active:scale-[0.98]"
          onClick={() => {
            void navigator.clipboard?.writeText(text).then(
              () => {
                setCopied(true);
                mark();
                window.setTimeout(() => setCopied(false), 1600);
              },
              () => {
                setCopied(false);
              },
            );
          }}
        >
          <Copy className="size-4" />
          {copied ? t(lang, "copied") : t(lang, "copyLink")}
        </button>
        <button
          type="button"
          className="inline-flex h-14 items-center justify-center gap-2 bg-ink px-3 text-sm font-extrabold uppercase tracking-[0.08em] text-paper active:scale-[0.98]"
          onClick={() => {
            void nativeShare({ title: headline, text, url: abs }).then((ok) => {
              if (ok) mark();
              else {
                void navigator.clipboard?.writeText(text);
                setCopied(true);
                mark();
                window.setTimeout(() => setCopied(false), 1600);
              }
            });
          }}
        >
          <Share2 className="size-4" />
          {t(lang, "nativeShare")}
        </button>
      </div>
    </div>
  );
}
