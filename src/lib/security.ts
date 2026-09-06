const WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

export function clientKey(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || "anon";
  return request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip") || "anon";
}

export function rateLimit(key: string, max = 20, windowMs = WINDOW_MS): boolean {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= max) {
    hits.set(key, arr);
    return false;
  }
  arr.push(now);
  hits.set(key, arr);
  return true;
}

export function tooLarge(request: Request, maxBytes = 24_000): boolean {
  const len = Number(request.headers.get("content-length") ?? 0);
  return Number.isFinite(len) && len > maxBytes;
}

export function sanitizeText(input: unknown, max = 4000): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, max);
}

export function isSafeHttpUrl(raw: string): boolean {
  try {
    const u = new URL(raw.trim());
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    if (u.username || u.password) return false;
    const host = u.hostname.toLowerCase();
    if (host === "localhost" || host.endsWith(".localhost")) return false;
    if (host === "127.0.0.1" || host === "::1" || host === "0.0.0.0") return false;
    if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(host)) return false;
    if (host === "169.254.169.254") return false;
    return true;
  } catch {
    return false;
  }
}

export function isEmail(raw: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw.trim()) && raw.length < 180;
}

export function isHoneypotTripped(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function jsonLimited<T>(request: Request, maxBytes = 24_000): Promise<T | null> {
  if (tooLarge(request, maxBytes)) return Promise.resolve(null);
  return request.json().catch(() => null) as Promise<T | null>;
}

export const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "X-DNS-Prefetch-Control": "off",
  "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
};

export function applySecurityHeaders(headers: Headers) {
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    if (!headers.has(k)) headers.set(k, v);
  }
  return headers;
}

export function limitedJson(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { ...SECURITY_HEADERS, "Cache-Control": "no-store" },
  });
}
