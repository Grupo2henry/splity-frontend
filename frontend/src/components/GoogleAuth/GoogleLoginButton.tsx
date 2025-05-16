/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { GoogleLogin } from "@react-oauth/google";
<<<<<<< HEAD
import React from "react";
import { fetchGoogleLogin } from "@/services/fetchGoogleLogin";// Importa la función del servicio

const GoogleLoginButton: React.FC = () => {
=======
import { fetchGoogleLogin } from "@/services/fetchGoogleLogin";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import CustomAlert from "../CustomAlert/CustomAlert";
import { useRouter } from "next/navigation";

export const GoogleLoginButton: React.FC = () => {
  const { googleLogin, errors } = useAuth();
  const [showErrorModal, setShowErrorModal] = useState(false);
>>>>>>> develop
  const router = useRouter();

  const handleSuccess = async (response: any) => {
    console.log("Respuesta de Google:", response);

    try {
      const token = await fetchGoogleLogin(response.credential);

      if (token) {
        console.log("Token recibido:", token);
        localStorage.setItem("authToken", token);
<<<<<<< HEAD
=======
        await googleLogin(response.credential);
>>>>>>> develop
        router.push("/Dashboard");
      } else {
        console.warn("No se encontró token en la respuesta");
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Error en la autenticación:", error);
      await googleLogin(response.credential);
      if (errors.length > 0) {
        setShowErrorModal(true);
      }
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          console.log("Fallo en el login");
          setShowErrorModal(true);
        }}
      />
      {showErrorModal && (
        <CustomAlert
          message={errors.length > 0 ? errors.join(", ") : "Error en la autenticación"}
          onClose={handleCloseErrorModal}
        />
      )}
    </>
  );
};

export default GoogleLoginButton;