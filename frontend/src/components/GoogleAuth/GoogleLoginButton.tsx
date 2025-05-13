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

>>>>>>> bc422bd48d086ead9919afc5740804ef002e22fc
  const handleSuccess = async (response: any) => {
    console.log("Google response:", response);

    try {
      const token = await fetchGoogleLogin(response.credential);

      if (token) {
        console.log("Token recibido:", token);
        localStorage.setItem("authToken", token);
<<<<<<< HEAD
        router.push("/Dashboard"); // o la ruta que prefieras
=======
        router.push("/Dashboard");
>>>>>>> bc422bd48d086ead9919afc5740804ef002e22fc
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