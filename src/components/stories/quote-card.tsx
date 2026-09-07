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
  dumbness: number;
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

  ctx.fillStyle = "#fff7ea";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#ffe400";
  ctx.fillRect(0, 0, w, 118);
  ctx.fillStyle = "#111111";
  ctx.font = "700 42px Oswald, Impact, sans-serif";
  ctx.fillText("YES IT'S REAL", 64, 78);
  ctx.font = "800 20px Inter, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("IT REALLY HAPPENED", w - 48, 76);
  ctx.textAlign = "left";

  ctx.fillStyle = "#e10600";
  ctx.fillRect(64, 170, 140, 48);
  ctx.fillStyle = "#fff8f6";
  ctx.font = "800 26px Inter, sans-serif";
  ctx.fillText("TRUE", 96, 204);

  ctx.fillStyle = "#e10600";
  ctx.font = "800 22px Inter, sans-serif";
  ctx.fillText(opts.kicker.toUpperCase(), 64, 280);

  ctx.fillStyle = "#111111";
  ctx.font = "700 64px Oswald, Impact, sans-serif";
  const lines = wrap(ctx, opts.headline.toUpperCase(), w - 128);
  let y = 370;
  for (const line of lines) {
    ctx.fillText(line, 64, y);
    y += 78;
  }

  ctx.fillStyle = "#4a453d";
  ctx.font = "600 28px Inter, sans-serif";
  ctx.fillText(`${opts.location}  ·  DUMBNESS ${opts.dumbness}/10`, 64, y + 36);

  ctx.fillStyle = "#111111";
  ctx.fillRect(0, h - 140, w, 140);
  ctx.fillStyle = "#ffe400";
  ctx.font = "800 28px Inter, sans-serif";
  ctx.fillText("IT SOUNDS FAKE. IT ISN'T.", 64, h - 78);
  ctx.fillStyle = "#fff7ea";
  ctx.font = "600 24px Inter, sans-serif";
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
          dumbness: story.dumbness,
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
