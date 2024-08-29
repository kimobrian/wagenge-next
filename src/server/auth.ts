import { UserRefreshClient } from "google-auth-library";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import {
  addCookiesToResponse,
  CookieOptionsRecord,
  CookieOptions,
} from "@/server/utils";
import { NextResponse, NextRequest } from "next/server";
import { TokenPayload } from "@/server/types";
import { cookies } from "next/headers";
import { isLocalhost } from "@/app/utils";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  JWT_SECRET,
  REFRESH_TOKEN_SECRET,
} = process.env;

const client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "postmessage"
);

export type VerifyToken = {
  status: "Verified" | "Expired" | "Logout";
  payload?: string | jwt.JwtPayload;
};

const accessTokenValidity = "2h";
const refreshTokenValidity = "45d"; // 45 days

export const verifyJwTToken = (token: string, secret: string): VerifyToken => {
  try {
    const verificationSecret = process.env[secret];
    if (!verificationSecret) throw new Error(`Missing Token Secret ${secret}`);
    const decoded = jwt.verify(token, verificationSecret);
    return { status: "Verified", payload: decoded };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { status: "Expired" };
    }
    return { status: "Logout" };
  }
};

export const generateAccessToken = (payload: TokenPayload) => {
  return jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: accessTokenValidity,
  });
};

export const generateRefreshToken = (payload: TokenPayload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET as string, {
    expiresIn: refreshTokenValidity,
  });
};

export const verifyGoogleAccessToken = async (token: string) => {
  const response = await client.getTokenInfo(token);
  if (response.aud !== GOOGLE_CLIENT_ID) {
    throw new Error("Token audience mismatch");
  }
  return response; // Contains information such as user_id, scopes, expiry, etc.
};

export const refreshGapiAccessToken = async (refreshToken: string) => {
  const refreshClient = new UserRefreshClient(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    refreshToken
  );

  const { credentials } = await refreshClient.refreshAccessToken();
  return credentials;
};

export const generateAndSetCookies = (
  response: NextResponse<unknown>,
  payload: TokenPayload,
  isLocalhost: boolean = false
) => {
  if (payload) {
    const accessToken = generateAccessToken(payload);
    // TODO: Save refresh token in DB
    const refreshToken = generateRefreshToken(payload);
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
      // google_access_token: {
      //   value: tokens.access_token as string,
      //   options: {
      //     secure: !isLocalhost,
      //     ...cookieOptions,
      //   },
      // },
    };

    addCookiesToResponse(response, cookies);
  }
};

export function withAuth(handler: (req: NextRequest) => Response) {
  return (req: NextRequest) => {
    const cookieStore = cookies();
    const isHostLocal = isLocalhost(req);
    const accessToken = cookieStore.get("access_token");
    const refreshToken = cookieStore.get("refresh_token");
    // const googleAccessToken = cookieStore.get("google_access_token");

    const logoutResponse = NextResponse.json(
      { message: "Logout" },
      { status: 401, statusText: "Unauthorized" }
    );

    if (!accessToken && !refreshToken) return logoutResponse;

    const verifyRefreshToken = verifyJwTToken(
      refreshToken?.value as string,
      "REFRESH_TOKEN_SECRET"
    );

    // If refresh token is expired or invalid, they must log in afresh
    if (verifyRefreshToken.status !== "Verified") return logoutResponse;

    const verifyAccessToken = verifyJwTToken(
      accessToken?.value as string,
      "JWT_SECRET"
    );

    if (verifyAccessToken.status === "Logout") {
      return logoutResponse;
    }

    if (verifyAccessToken.status === "Expired") {
      // TODO: Get user from DB and set payload
      const userPayload = {
        name: "Wagenge",
        // email: payload.email,
        picture:
          "https://lh3.googleusercontent.com/a/ACg8ocKGFfHTvxo4j3eyMdcqkcJFzzxwnzp26l4NoVATjjViC4wwEECiPA=s96-c",
        sub: "103221132928402864935",
      };
      const token = generateAccessToken(userPayload);
      const cookieOptions: CookieOptions = {
        httpOnly: true,
        sameSite: "lax",
        signed: true,
      };
      cookies().set("access_token", token, {
        secure: !isHostLocal,
        ...{ ...cookieOptions, httpOnly: false },
      });
    }

    // If the token is valid, call the original handler
    return handler(req);
  };
}
