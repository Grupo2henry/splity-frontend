"use client";

import { GoogleLogin } from "@react-oauth/google"
import React from "react";

const GoogleLoginButton: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSuccess = async (response: any) => {
    console.log("Google response:", response);

    try {
      const apiResponse = await fetch(
        "http://localhost:4000/auth/google-authentication",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: response.credential,
          }),
        }
      );

      if (!apiResponse.ok) {
        throw new Error(`Error: ${apiResponse.status}`);
      }

      const tokenFromHeaders = apiResponse.headers.get("Authorization");
      const responseData = await apiResponse.json();
      const tokenFromBody = responseData.token || responseData.accessToken;
      const token = tokenFromHeaders || tokenFromBody;

      if (token) {
        console.log("Token recibido:", token);
        localStorage.setItem("authToken", token);
        // Aquí podrías redirigir usando useRouter de next/navigation
      } else {
        console.warn("No se encontró token en la respuesta");
      }
    } catch (error) {
      console.error("Error en la autenticación:", error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Login Failed")}
    />
  );
};

export default GoogleLoginButton;
