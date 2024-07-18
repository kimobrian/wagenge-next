import { type NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import {
  addCookiesToResponse,
  CookieOptionsRecord,
  CookieOptions,
} from "@/server/utils";
import { generateAccessToken, generateRefreshToken } from "@/server/auth";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

const client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "postmessage"
);

export async function GET(request: NextRequest) {
  console.log("Login attempt...");
  const res = await fetch("https://jsonplaceholder.typicode.com/todos");
  const data = await res.json();
  return Response.json({ data });
}

export async function POST(request: NextRequest) {
  const isLocalhost = request.headers.get("host")?.includes("localhost");

  const body = await request.json();
  const { code /*, codeVerifier*/ } = body;
  const response = NextResponse.json({ message: "Logged In Successfully" });
  try {
    const { tokens } = await client.getToken(code);

    if (tokens.id_token) {
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (payload) {
        const userPayload = {
          name: payload.name,
          // email: payload.email,
          picture: payload.picture,
          sub: payload.sub,
        };

        const accessToken = generateAccessToken(userPayload);
        console.log("🚀 ~ POST ~ accessToken:", accessToken);
        // TODO: Save refresh token in DB
        const refreshToken = generateRefreshToken(userPayload);
        console.log("🚀 ~ POST ~ refreshToken:", refreshToken);

        const cookieOptions: CookieOptions = {
          httpOnly: true,
          sameSite: "lax",
          signed: true,
        };

        const cookies: CookieOptionsRecord = {
          access_token: {
            value: accessToken,
            options: {
              secure: !isLocalhost,
              ...{ ...cookieOptions, httpOnly: false },
            },
          },
          refresh_token: {
            value: refreshToken,
            options: {
              secure: !isLocalhost,
              ...cookieOptions,
            },
          },
          google_access_token: {
            value: tokens.access_token as string,
            options: {
              secure: !isLocalhost,
              ...cookieOptions,
            },
          },
        };

        addCookiesToResponse(response, cookies);
      }
    }

    return response;
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Authentication failed" },
      { status: 401, statusText: "Authentication failed" }
    );
  }
}
