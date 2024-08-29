import { type NextRequest, NextResponse } from "next/server";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { generateAndSetCookies } from "@/server/auth";
import { isLocalhost } from "@/app/utils";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

const client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "postmessage"
);

export async function POST(request: NextRequest) {
  const isHostLocal = isLocalhost(request);

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

      const payload: TokenPayload | undefined = ticket.getPayload();

      if (payload) {
        const userPayload = {
          name: payload.name,
          // email: payload.email,
          picture: payload.picture,
          sub: payload.sub,
        };
        generateAndSetCookies(response, userPayload, isHostLocal);
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
