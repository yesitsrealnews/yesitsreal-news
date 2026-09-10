import { useCallback, useEffect, useState, type FormEvent } from "react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { fromNow } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Honeypot } from "@/components/site/honeypot";

type CommentRow = {
  id: string;
  author: string;
  body: string;
  createdAt: string;
};

export function ReaderComments({ storyId, lang }: { storyId: string; lang: Lang }) {
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [hp, setHp] = useState("");
  const [sending, setSending] = useState(false);
  const [thanks, setThanks] = useState(false);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/comments?storyId=${encodeURIComponent(storyId)}`);
      const data = (await res.json()) as {
        ok?: boolean;
        comments?: CommentRow[];
        disabled?: boolean;
      };
      if (data.disabled) setDisabled(true);
      setComments(Array.isArray(data.comments) ? data.comments : []);
    } catch {
      setDisabled(true);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [storyId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr("");
    setThanks(false);
    if (hp.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyId,
          author: author.trim() || undefined,
          body,
          company_url: hp,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        reason?: string;
        comment?: CommentRow;
      };
      if (!res.ok || !data.ok || !data.comment) {
        if (data.reason === "unavailable" || res.status === 503) {
          setDisabled(true);
          setErr(t(lang, "commentsDisabled"));
        } else if (data.reason === "rate-limited") {
          setErr(t(lang, "rateLimited"));
        } else {
          setErr(t(lang, "commentsError"));
        }
        return;
      }
      setComments((prev) => [...prev, data.comment!]);
      setBody("");
      setThanks(true);
    } catch {
      setErr(t(lang, "commentsError"));
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="mt-8 border-2 border-ink bg-paper p-5">
      <p className="kicker text-signal">{t(lang, "commentsTitle")}</p>
      <h2 className="mt-2 font-serif text-3xl uppercase leading-none">{t(lang, "commentsTitle")}</h2>

      {disabled ? (
        <p className="mt-4 border border-rule bg-paper-2 p-3 text-sm text-ink-muted">{t(lang, "commentsDisabled")}</p>
      ) : null}

      <div className="mt-5 space-y-4">
        {loading ? (
          <p className="text-sm text-ink-muted">…</p>
        ) : comments.length === 0 && !disabled ? (
          <p className="border border-rule bg-paper-2 p-3 text-sm text-ink-muted">{t(lang, "commentsEmpty")}</p>
        ) : (
          <ul className="space-y-3">
            {comments.map((c) => (
              <li key={c.id} className="border border-rule bg-card p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-xs font-extrabold uppercase tracking-[0.12em]">{c.author}</p>
                  <time className="text-[0.7rem] text-ink-muted" dateTime={c.createdAt}>
                    {fromNow(c.createdAt, lang)}
                  </time>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink">{c.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!disabled ? (
        <form className="relative mt-6 space-y-3 border-t-2 border-ink pt-5" onSubmit={onSubmit}>
          <Honeypot value={hp} onChange={setHp} />
          <div>
            <Label htmlFor={`comments-name-${storyId}`}>{t(lang, "commentsName")}</Label>
            <Input
              id={`comments-name-${storyId}`}
              value={author}
              maxLength={40}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder={t(lang, "commentsAnon")}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor={`comments-body-${storyId}`}>{t(lang, "commentsPlaceholder")}</Label>
            <Textarea
              id={`comments-body-${storyId}`}
              required
              minLength={8}
              maxLength={1200}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={t(lang, "commentsPlaceholder")}
              className="mt-1 min-h-28"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" variant="signal" disabled={sending || body.trim().length < 8}>
              {sending ? t(lang, "commentsSending") : t(lang, "commentsSubmit")}
            </Button>
            {thanks ? <p className="text-sm text-true">{t(lang, "commentsThanks")}</p> : null}
            {err ? <p className="text-sm text-signal">{err}</p> : null}
          </div>
        </form>
      ) : null}
    </section>
  );
}
