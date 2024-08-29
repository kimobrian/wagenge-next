import { CodeResponse } from "@react-oauth/google";

export type LoginResponse = {
  exp: number;
  iat: number;
  name: string;
  picture: string;
  sub: string;
};

export type CodeResponseSuccess = Omit<
  CodeResponse,
  "error" | "error_description" | "error_uri"
>;

export type CodeResponseError = Pick<
  CodeResponse,
  "error" | "error_description" | "error_uri"
>;
