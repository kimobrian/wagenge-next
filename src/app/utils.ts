import { jwtDecode } from "jwt-decode";
import { LoginResponse } from "@/app/types";
import { type NextRequest } from "next/server";

export const isTokenExpired = (token: string | undefined) => {
  if (!token) return true;
  try {
    const decodedToken = jwtDecode(token) as LoginResponse;
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (_) {
    return true;
  }
};

export const isLocalhost = (request: NextRequest): boolean => {
  return request.headers.get("host")?.includes("localhost") || false;
};
