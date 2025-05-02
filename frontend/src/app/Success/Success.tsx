import NavBar_Dashboard from "@/components/NavBar/NavBar_Dashboard/NavBar_Dashboard";
import React from "react";

const Success = () => {
  return (
    <div className="flex flex-col w-full h-full items-center justify-center bg-green-100">
      {/* <Image src="/icono-exito.png" alt="Pago Exitoso" width={100} height={100} /> */}
      <h1 className="text-2xl font-bold text-green-600 mb-4">¡Pago Exitoso!</h1>
      <p className="text-gray-700 mb-8">Tu suscripción se ha procesado correctamente.</p>
      <NavBar_Dashboard /> {/* O el componente de navegación que prefieras */}
      {/* Aquí puedes agregar más detalles sobre la compra, un enlace al dashboard, etc. */}
    </div>
  );
};

export default Success;