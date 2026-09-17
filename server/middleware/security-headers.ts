const HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "X-DNS-Prefetch-Control": "off",
  "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
  "X-Frame-Options": "DENY",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob: https:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
};

function pathOf(event: unknown): string {
  const e = event as { url?: URL; path?: string };
  if (e?.url?.pathname) return e.url.pathname;
  if (typeof e?.path === "string") return e.path.split("?")[0] || "";
  return "";
}

function isDeskPath(pathname: string): boolean {
  return (
    pathname === "/cambuse" ||
    pathname.startsWith("/cambuse/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/api/desk" ||
    pathname.startsWith("/api/")
  );
}

function cacheControlFor(pathname: string): string | null {
  if (isDeskPath(pathname)) return "private, no-store";
  if (
    pathname.startsWith("/covers/") ||
    pathname.startsWith("/brand/") ||
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/ads/") ||
    pathname.startsWith("/fonts/") ||
    pathname === "/favicon.svg" ||
    pathname === "/og.jpg" ||
    pathname === "/og.webp"
  ) {
    return "public, max-age=31536000, immutable";
  }
  if (pathname.endsWith(".xml") || pathname === "/robots.txt" || pathname === "/ads.txt") {
    return "public, s-maxage=120, stale-while-revalidate=300";
  }
  if (!pathname.startsWith("/api/")) {
    return "public, s-maxage=30, stale-while-revalidate=90";
  }
  return null;
}

export default async function securityHeadersMiddleware(
  event: unknown,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const result = await next();
  if (result instanceof Response) {
    const headers = new Headers(result.headers);
    for (const [k, v] of Object.entries(HEADERS)) {
      if (!headers.has(k)) headers.set(k, v);
    }
    const path = pathOf(event);
    if (isDeskPath(path) && !headers.has("X-Robots-Tag")) {
      headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    }
    const cache = cacheControlFor(path);
    if (cache && !headers.has("Cache-Control")) {
      headers.set("Cache-Control", cache);
      headers.set("CDN-Cache-Control", cache);
      headers.set("Vercel-CDN-Cache-Control", cache);
    }
    const proto = (event as { req?: { headers?: Headers } })?.req?.headers?.get("x-forwarded-proto");
    if (proto === "https" && !headers.has("Strict-Transport-Security")) {
      headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }
    return new Response(result.body, {
      status: result.status,
      statusText: result.statusText,
      headers,
    });
  }
  return result;
}
