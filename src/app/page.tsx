"use client";

import React, { useEffect, useState } from "react";
import { useGoogleLogin, CodeResponse } from "@react-oauth/google";
import { Helmet } from "react-helmet";
import { GoogleLoginButton, Wagenge, Center } from "@/components";
import Image from "next/image";
import {
  LoginResponse,
  CodeResponseSuccess,
  CodeResponseError,
} from "@/app/types";
import { isTokenExpired } from "@/app/utils";

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const App = () => {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("access_token");
    const isExpired = isTokenExpired(token);
    async function refreshToken() {
      let res = await fetch("/api/auth/refresh", { method: "POST"});
      res = await res.json();
      console.log("Response:::::", res);
    }
    if (isExpired) {
      console.log(">>>>>>>>>>Expired", isExpired);
      refreshToken();
    }
    if (token) {
      const decoded = jwtDecode(token);
      const userInfo = decoded as LoginResponse;
      console.log("🚀 ~ useEffect ~ userInfo:", userInfo);
      setUser(userInfo);
    }
    setIsLoading(false);
  }, []);

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
        const decoded = jwtDecode(token) as LoginResponse;
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

  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout");
    if (response.ok) {
      Cookies.remove("access_token");
      setUser(null);
    }
  };

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content="Team Wagenge FC"></meta>
        <title>Wagenge FC</title>
      </Helmet>

      {isLoading && !user ? (
        <Center>
          <Wagenge />
          <h3 className="font-bold">...loading...</h3>
        </Center>
      ) : null}

      {!isLoading && user ? (
        <Center>
          <Image
            src={user.picture}
            alt="Profile"
            width={50}
            height={50}
            className="rounded-full"
          />
          <h2 className="font-bold">Hello, {user.name}</h2>
          <button onClick={handleLogout}>Logout</button>
        </Center>
      ) : null}
      {!isLoading && !user ? (
        <Center>
          <Wagenge />
          <GoogleLoginButton onClick={login} />
        </Center>
      ) : null}
    </div>
  );
};

export default App;
