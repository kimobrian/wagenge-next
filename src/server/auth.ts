import { UserRefreshClient } from "google-auth-library";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

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

type TokenPayload = {
  name: string | undefined;
  picture: string | undefined;
  sub: string;
};

const accessTokenValidity = "2h";
const refreshTokenValidity = "45d"; // 45 days

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
