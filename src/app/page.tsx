"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGoogleLogin, CodeResponse } from "@react-oauth/google";
// import { getDecodedAccessToken } from "@/utils/getDecodedAccessToken";
import { Helmet } from "react-helmet";
import Link from "next/link";
import { GoogleLoginButton } from "@/components";

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

axios.defaults.withCredentials = true;

export type LoginResponse = {
  exp: number;
  iat: number;
  name: string;
  picture: string;
  sub: string;
};

type CodeResponseSuccess = Omit<
  CodeResponse,
  "error" | "error_description" | "error_uri"
>;
type CodeResponseError = Pick<
  CodeResponse,
  "error" | "error_description" | "error_uri"
>;

const NEXT_PUBLIC_APP_SERVER = "http://localhost:4000";

const App = () => {
  // const [token, setToken] = useState(getDecodedAccessToken());
  // console.log("🚀 ~ App ~ token:", token);

  const [user, setUser] = useState<LoginResponse | null>(null);

  useEffect(() => {
    // fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/current_user");
      setUser(res.data);
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      const decoded = jwtDecode(token);
      const userInfo = decoded;
      console.log("🚀 ~ useEffect ~ userInfo:", userInfo);
      setUser(userInfo);
    }
  }, []);

  useEffect(() => {
    console.log(">>>>", user);
  }, [user]);

  const handleLoginSuccess = async (tokenResponse: CodeResponseSuccess) => {
    const { code } = tokenResponse; // Assuming tokenResponse contains PKCE code and code_verifier
    try {
      await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          code,
        }),
        headers: {
          "Content-type": "application/json",
        },
      });
      // const decodedToken = getDecodedAccessToken();
      const token = Cookies.get("access_token");
      if (token) {
        const decoded = jwtDecode(token);
        console.log("🚀 ~ handleLoginSuccess ~ decodedToken:", decoded);
        setUser(decoded);
      }
      // const token = Cookies.get("access_token");
      // if (token) {
      //   setToken(token);
      // }
    } catch (error) {
      console.error(error);
    }
  };

  // TODO: Handle error properly
  const handleLoginFailure = (error: CodeResponseError) => {
    console.error(error);
  };

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: handleLoginSuccess,
    onError: handleLoginFailure,
  });

  const handleLogout = () => {
    axios.get("/api/auth/logout").then(() => {
      setUser(null);
    });
  };

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content="Team Wagenge FC"></meta>
        <title>Wagenge FC</title>
      </Helmet>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        {user ? (
          <div>
            <img src={user.picture} alt="Profile" />
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div>
            <GoogleLoginButton onClick={login} />
          </div>
        )}
        {user ? <h2>Hello, {user.name}</h2> : null}
      </div>
    </div>
  );
};

export default App;
