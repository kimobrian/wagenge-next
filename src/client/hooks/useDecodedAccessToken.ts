import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const useDecodedAccessToken = () => {
  const [decodedToken, setDecodedToken] = useState(null);

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // Check if token is expired
        if (decoded.exp < currentTime) {
          // Token is expired, refresh it
          refreshAccessToken();
        } else {
          setDecodedToken(decoded);
        }
      } catch (error) {
        console.error("Failed to decode access token:", error);
      }
    }
  }, []);

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post("/api/refresh_token");
      const newToken = response.data.accessToken;

      // Update the cookie with the new token
      Cookies.set("access_token", newToken, { httpOnly: true, secure: true });

      // Decode and set the new token
      const decoded = jwtDecode(newToken);
      setDecodedToken(decoded);
    } catch (error) {
      console.error("Failed to refresh access token:", error);
    }
  };

  return decodedToken;
};

export default useDecodedAccessToken;
