/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { GoogleLogin } from "@react-oauth/google";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import CustomAlert from "../../CustomAlert/CustomAlert";

export const GoogleLoginButton: React.FC = () => {
  const { googleLogin, errors } = useAuth();
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleSuccess = async (response: any) => {
    console.log("Respuesta de Google:", response);

    try {
      // Directamente llama a googleLogin del contexto, que ya maneja la lógica de fetch y redirección
      await googleLogin(response.credential);
    } catch (error) {
      console.error("Error en la autenticación con Google:", error);
      // El error ya es manejado por el AuthContext y se almacena en el estado `errors`
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
          console.log("Fallo en el login de Google");
          setShowErrorModal(true); // Mostrar modal de error si falla el login inicial de Google
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