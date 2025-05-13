/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import React from "react";
import { fetchGoogleLogin } from "@/services/fetchGoogleLogin";// Importa la función del servicio
import { useUser } from "@/context/UserContext";

export const GoogleLoginButton: React.FC = () => {
  const router = useRouter();
  const { user, loading, triggerUserReload } = useUser();
  console.log("Este es el user desde GoogleLoginButton: ", user, loading);
  const handleSuccess = async (response: any) => {
  try {
    const token = await fetchGoogleLogin(response.credential);
    if (token) {
      localStorage.setItem("token", token); // Asegúrate de que el token se guarde
      router.push("/Dashboard");
      triggerUserReload(); // Llama a la función para forzar la re-verificación
    } else {
        console.warn("No se encontró token en la respuesta del servicio");
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