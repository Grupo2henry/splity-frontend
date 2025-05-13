/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { GoogleLogin } from "@react-oauth/google";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import CustomAlert from "../CustomAlert/CustomAlert"; // Importa el componente modal de alerta

export const GoogleLoginButton: React.FC = () => {
  const { googleLogin, errors } = useAuth();
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleSuccess = async (response: any) => {
    await googleLogin(response.credential);
    if (errors.length > 0) {
      setShowErrorModal(true);
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Login Failed")}
      />
      {showErrorModal && (
        <CustomAlert
          message={errors.join(", ")}
          onClose={handleCloseErrorModal}
          //type="error"
        />
      )}
    </>
  );
};

export default GoogleLoginButton;