"use client";

import NavBar_Dashboard from "@/components/NavBar/NavBar_Dashboard/NavBar_Dashboard";
import React from "react";

const Failure = () => {
  return (
    <div className="flex flex-col w-full h-full items-center justify-center bg-red-100">
      {/* <Image src="/icono-error.png" alt="Pago Fallido" width={100} height={100} /> */}
      <h1 className="text-2xl font-bold text-red-600 mb-4">¡Pago Fallido!</h1>
      <p className="text-gray-700 mb-8">Hubo un problema al procesar tu pago. Por favor, intenta nuevamente o contacta a soporte.</p>
      <NavBar_Dashboard /> {/* O el componente de navegación que prefieras */}
      {/* Aquí puedes agregar un botón para reintentar el pago, un enlace a soporte, etc. */}
    </div>
  );
};

export default Failure;