import NavBar_Dashboard from "@/components/NavBar/NavBar_Dashboard/NavBar_Dashboard";
import React from "react";

const Pending = () => {
  return (
    <div className="flex flex-col w-full h-full items-center justify-center bg-yellow-100">
      {/* <Image src="/icono-pendiente.png" alt="Pago Pendiente" width={100} height={100} /> */}
      <h1 className="text-2xl font-bold text-yellow-600 mb-4">Pago Pendiente</h1>
      <p className="text-gray-700 mb-8">Estamos esperando la confirmación de tu pago. Esto puede tardar unos minutos.</p>
      <NavBar_Dashboard /> {/* O el componente de navegación que prefieras */}
      {/* Aquí puedes agregar información adicional sobre el estado pendiente, un enlace para verificar el estado, etc. */}
    </div>
  );
};

export default Pending;