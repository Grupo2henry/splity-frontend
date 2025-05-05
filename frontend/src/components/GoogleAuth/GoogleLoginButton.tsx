/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import React from "react";
import { useToken } from "../TokenContext/token-context";

const GoogleLoginButton: React.FC = () => {
  const router = useRouter();
  const { setToken } = useToken(); // Obtener la función para setear el token
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
      const tokenFromBody = responseData.access_token.token || responseData.accessToken;
      const token = tokenFromHeaders || tokenFromBody;

      if (token) {
        console.log("Token recibido:", token);
        localStorage.setItem("authToken", token);
        setToken(token);
        console.log("se seteo token")
        router.push("/Dashboard"); // o la ruta que prefieras
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
