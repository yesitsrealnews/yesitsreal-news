import { useState } from "react";
import { Download } from "lucide-react";
import type { Lang, Story } from "@/lib/types";
import { t } from "@/lib/i18n";
import { storyCopy } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { SITE_DOMAIN } from "@/lib/brand";

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines.slice(0, 7);
}

export async function renderQuotePng(opts: {
  headline: string;
  location: string;
  kicker: string;
}): Promise<Blob | null> {
  const w = 1080;
  const h = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  await document.fonts?.ready.catch(() => undefined);

  ctx.fillStyle = "#0b0b0b";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#e10600";
  ctx.fillRect(0, 0, w, 8);
  ctx.fillStyle = "#f4efe4";
  ctx.font = "800 42px 'Bricolage Grotesque', Impact, sans-serif";
  ctx.fillText("YES IT'S REAL NEWS", 64, 88);
  ctx.font = "800 18px Figtree, sans-serif";
  ctx.textAlign = "right";
  ctx.fillStyle = "#e10600";
  ctx.fillText("IT REALLY HAPPENED", w - 48, 84);
  ctx.textAlign = "left";

  ctx.fillStyle = "#e10600";
  ctx.fillRect(64, 168, 148, 48);
  ctx.fillStyle = "#fff8f6";
  ctx.font = "800 22px Figtree, sans-serif";
  ctx.fillText("TRUE", 104, 200);

  ctx.fillStyle = "#e10600";
  ctx.font = "800 20px Figtree, sans-serif";
  ctx.fillText(opts.kicker.toUpperCase(), 64, 280);

  ctx.fillStyle = "#f4efe4";
  ctx.font = "800 64px 'Bricolage Grotesque', Impact, sans-serif";
  const lines = wrap(ctx, opts.headline, w - 128);
  let y = 370;
  for (const line of lines) {
    ctx.fillText(line, 64, y);
    y += 78;
  }

  ctx.fillStyle = "#b5b0a6";
  ctx.font = "600 28px Figtree, sans-serif";
  ctx.fillText(opts.location, 64, y + 36);

  ctx.fillStyle = "#161616";
  ctx.fillRect(0, h - 140, w, 140);
  ctx.fillStyle = "#e10600";
  ctx.font = "800 28px Figtree, sans-serif";
  ctx.fillText("IT SOUNDS FAKE. IT ISN'T.", 64, h - 78);
  ctx.fillStyle = "#f4efe4";
  ctx.font = "600 24px Figtree, sans-serif";
  ctx.fillText(SITE_DOMAIN, 64, h - 40);

  return await new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
}

export function QuoteCardButton({
  story,
  lang,
  onSaved,
}: {
  story: Story;
  lang: Lang;
  onSaved?: () => void;
}) {
  const [msg, setMsg] = useState("");
  const copy = storyCopy(story, lang);

  return (
    <Button
      type="button"
      variant="outline"
      onClick={async () => {
        const blob = await renderQuotePng({
          headline: copy.headline,
          location: story.location,
          kicker: t(lang, "truePill"),
        });
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `yes-its-real-${story.slug}.png`;
        a.click();
        URL.revokeObjectURL(url);
        setMsg(t(lang, "cardSaved"));
        onSaved?.();
      }}
    >
      <Download className="size-4" />
      {msg || t(lang, "downloadCard")}
    </Button>
  );
}
