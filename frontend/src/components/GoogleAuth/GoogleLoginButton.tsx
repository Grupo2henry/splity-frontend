/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import React from "react";
<<<<<<< HEAD

const GoogleLoginButton: React.FC = () => {
  const router = useRouter();
=======
import { fetchGoogleLogin } from "@/services/fetchGoogleLogin";// Importa la función del servicio

const GoogleLoginButton: React.FC = () => {
  const router = useRouter();

>>>>>>> main
  const handleSuccess = async (response: any) => {
    console.log("Google response:", response);

    try {
      const token = await fetchGoogleLogin(response.credential);

      if (token) {
        console.log("Token recibido:", token);
        localStorage.setItem("authToken", token);
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