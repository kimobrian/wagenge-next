import { serialize } from "cookie";
import { NextResponse } from "next/server";
import { cookies as nextCookies } from "next/headers";

export type CookieOptions = {
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
  maxAge?: number;
  path?: string;
  signed?: boolean;
};

export type CookieOptionsRecord = Record<
  string,
  { value: string; options: CookieOptions }
>;

export function setCookie(
  name: string,
  value: string,
  options: CookieOptions & { signed?: boolean }
) {
  return serialize(name, value, {
    secure: options.secure ?? true,
    httpOnly: options.httpOnly ?? true,
    sameSite: options.sameSite ?? "lax",
    maxAge: options.maxAge ?? 60 * 60 * 24 * 7, // 1 week by default
    path: options.path ?? "/",
  });
}

export function addCookiesToResponse(
  response: NextResponse,
  cookies: CookieOptionsRecord
) {
  Object.entries(cookies).map(([name, { value, options }]) => {
    nextCookies().set(name, value, options);
  });
  return response;
}
