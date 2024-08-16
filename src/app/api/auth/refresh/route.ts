import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { verifyJwTToken, generateAndSetCookies } from "@/server/auth";
import { isLocalhost } from "@/app/utils";
import { withAuth } from "@/server/auth";

export const POST = withAuth((request: NextRequest) => {
  //TODO: This is a test endpoint to test refreshing of tokens
  // Handle POST request for the protected route
  console.log("Token Refreshed.....");
  return NextResponse.json({ message: "Tokens Refreshed" });
});
