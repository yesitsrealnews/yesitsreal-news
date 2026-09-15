import { timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";

export const DESK_COOKIE = "yir_cambuse";
const MAX_AGE = 60 * 60 * 24 * 30;

function deskCode(): string {
  return (process.env.DESK_CODE || process.env.CAMBUSE_CODE || "1aPepette").trim();
}

function deskSecret(): Uint8Array {
  const raw = process.env.DESK_SECRET || process.env.CAMBUSE_SECRET || "yir-cambuse-rotate-in-vercel-env";
  return new TextEncoder().encode(raw);
}

export function codeMatches(input: string): boolean {
  const a = Buffer.from(input.normalize("NFKC"));
  const b = Buffer.from(deskCode());
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function mintDeskToken(): Promise<string> {
  return new SignJWT({ desk: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(deskSecret());
}

export async function deskTokenOk(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, deskSecret());
    return payload.desk === true;
  } catch {
    return false;
  }
}

export function readDeskCookie(request: Request): string | undefined {
  const raw = request.headers.get("cookie") || "";
  const hit = raw.split(";").map((p) => p.trim()).find((p) => p.startsWith(`${DESK_COOKIE}=`));
  if (!hit) return undefined;
  return decodeURIComponent(hit.slice(DESK_COOKIE.length + 1));
}

export function deskCookieHeader(token: string, request: Request): string {
  const proto = request.headers.get("x-forwarded-proto") || "";
  const host = (request.headers.get("x-forwarded-host") || request.headers.get("host") || "").split(":")[0];
  const secure = proto === "https" ? "; Secure" : "";
  const domain = host.endsWith("yesitsreal.news") ? "; Domain=.yesitsreal.news" : "";
  return `${DESK_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}${secure}${domain}`;
}

export function clearDeskCookieHeader(request?: Request): string {
  const host = (request?.headers.get("x-forwarded-host") || request?.headers.get("host") || "").split(":")[0];
  const domain = host.endsWith("yesitsreal.news") ? "; Domain=.yesitsreal.news" : "";
  return `${DESK_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${domain}`;
}
