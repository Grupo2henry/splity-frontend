// components/Alert.tsx
import React, { useEffect } from "react";

interface AlertProps {
  type: "success" | "error";
  message: string;
  backgroundColor?: string; // Color de fondo personalizable
  textColor?: string; // Color del texto personalizable
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({
  type,
  message,
  backgroundColor = type === "success" ? "bg-green-500" : "bg-red-500", // Color por defecto según el tipo
  textColor = "text-white", // Color de texto por defecto
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Cerrar alerta después de 5 segundos

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50 p-4 rounded-md shadow-lg ${backgroundColor} ${textColor}`}
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)", // Centrado absoluto
        maxWidth: "80%",
        minWidth: "250px", // Puedes ajustar el tamaño mínimo
      }}
    >
      <div className="text-center">{message}</div>
    </div>
  );
};

export default Alert;
