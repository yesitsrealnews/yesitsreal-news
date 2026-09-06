import { timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";

export const DESK_COOKIE = "yir_cambuse";
const MAX_AGE = 60 * 60 * 12;

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
  const secure = proto === "https" ? "; Secure" : "";
  return `${DESK_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${MAX_AGE}${secure}`;
}

export function clearDeskCookieHeader(): string {
  return `${DESK_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
}
