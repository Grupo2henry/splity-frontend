"use client"; // Marca el componente como un componente de cliente si usa hooks de Next.js

import NavBar_Dashboard from "@/components/NavBar/NavBar_Dashboard/NavBar_Dashboard";
import React from "react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const Failure = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = searchParams.get('status');
    const paymentId = searchParams.get('payment_id');

    if (status === 'approved' && paymentId) {
      const token = localStorage.getItem('token');

      fetch('http://localhost:4000/payments/test', { // ¡Cuidado! Esto apunta a localhost en producción
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          transaction_id: paymentId,
          status: "approved",
          amount: 100, // O el valor que corresponda
          paid_at: new Date(),
        }),
      })
      .then(res => res.json())
      .then(data => console.log('✅ Pago registrado:', data))
      .catch(err => console.error('❌ Error al registrar el pago:', err));
    }
  }, [searchParams]);

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