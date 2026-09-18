import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { createFileRoute } from "@tanstack/react-router";
import { appendDeployEvent, sanitizeDeployEvent } from "@/lib/deploy-log";
import { limitedJson, rateLimit, isSafeHttpUrl } from "@/lib/security";

function noIndex(body: unknown, status: number): Response {
  const res = limitedJson(body, status);
  const headers = new Headers(res.headers);
  headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return new Response(res.body, { status: res.status, headers });
}

function vercelSecret(): string {
  return (process.env.VERCEL_DEPLOY_WEBHOOK_SECRET || "").trim();
}

function grokWebhook(): { url: string; secret: string } | null {
  const url = (process.env.GROK_DEPLOY_WEBHOOK_URL || "").trim();
  const secret = (process.env.GROK_DEPLOY_WEBHOOK_SECRET || "").trim();
  if (!isSafeHttpUrl(url) || !secret) return null;
  return { url, secret };
}

function hexHmacSha1(raw: string, secret: string): string {
  return createHmac("sha1", secret).update(raw).digest("hex");
}

function signatureOk(raw: string, header: string | null, secret: string): boolean {
  if (!header || !secret) return false;
  const incoming = header.trim().replace(/^sha1=/i, "");
  const expected = hexHmacSha1(raw, secret);
  const a = Buffer.from(incoming);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function grokSign(secret: string, id: string, ts: string, body: string): string {
  const b64 = secret.startsWith("whsec_") ? secret.slice(6) : secret;
  const key = Buffer.from(b64, "base64");
  const sig = createHmac("sha256", key).update(`${id}.${ts}.${body}`).digest("base64");
  return `v1,${sig}`;
}

type VercelHook = {
  id?: string;
  type?: string;
  createdAt?: number | string;
  payload?: {
    target?: string | null;
    deployment?: { id?: string; url?: string; name?: string };
    error?: { message?: string } | string;
    project?: { id?: string };
  };
};

function isProduction(target: string): boolean {
  const t = target.toLowerCase();
  return t === "production" || t === "prod";
}

async function forwardGrok(body: string): Promise<void> {
  const grok = grokWebhook();
  if (!grok) return;
  const id = `msg_${randomUUID()}`;
  const ts = String(Math.floor(Date.now() / 1000));
  const sig = grokSign(grok.secret, id, ts, body);
  await fetch(grok.url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "webhook-id": id,
      "webhook-timestamp": ts,
      "webhook-signature": sig,
    },
    body,
    signal: AbortSignal.timeout(8_000),
  }).catch(() => null);
}

export const Route = createFileRoute("/api/deploy-notify")({
  server: {
    handlers: {
      GET: async () =>
        noIndex(
          {
            ok: true,
            configured: Boolean(vercelSecret()),
          },
          200,
        ),
      POST: async ({ request }) => {
        if (!rateLimit("deploy-notify", 40, 60_000)) {
          return noIndex({ ok: false, reason: "rate-limited" }, 429);
        }
        const secret = vercelSecret();
        if (!secret) return noIndex({ ok: false, reason: "unconfigured" }, 503);

        const raw = await request.text();
        if (raw.length > 80_000) return noIndex({ ok: false, reason: "payload" }, 413);
        const sig = request.headers.get("x-vercel-signature");
        if (!signatureOk(raw, sig, secret)) {
          return noIndex({ ok: false, reason: "signature" }, 403);
        }

        let parsed: VercelHook;
        try {
          parsed = JSON.parse(raw) as VercelHook;
        } catch {
          return noIndex({ ok: false, reason: "json" }, 400);
        }

        const type = typeof parsed.type === "string" ? parsed.type : "";
        const target = typeof parsed.payload?.target === "string" ? parsed.payload.target : "";
        const errorRaw = parsed.payload?.error;
        const error =
          typeof errorRaw === "string"
            ? errorRaw
            : typeof errorRaw?.message === "string"
              ? errorRaw.message
              : "";

        const interesting =
          type === "deployment.error" ||
          type === "deployment.canceled" ||
          (type === "deployment.succeeded" && isProduction(target));
        if (!interesting) {
          return noIndex({ ok: true, ignored: true, type, target }, 200);
        }

        const event = sanitizeDeployEvent({
          eventId: typeof parsed.id === "string" ? parsed.id : randomUUID(),
          type,
          target: target || (type === "deployment.error" ? "production" : "unknown"),
          url: parsed.payload?.deployment?.url ? `https://${parsed.payload.deployment.url}` : "",
          deploymentId: parsed.payload?.deployment?.id || "",
          error,
          at:
            typeof parsed.createdAt === "number"
              ? new Date(parsed.createdAt).toISOString()
              : typeof parsed.createdAt === "string"
                ? parsed.createdAt
                : new Date().toISOString(),
        });

        const stored = await appendDeployEvent(event).catch(() => null);
        if (!stored?.duplicate) {
          await forwardGrok(JSON.stringify(event));
        }

        return noIndex({ ok: true, duplicate: Boolean(stored?.duplicate), type, target }, 200);
      },
    },
  },
});
