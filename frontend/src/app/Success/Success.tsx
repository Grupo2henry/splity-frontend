'use client';

import NavBar_Dashboard from "@/components/NavBar/NavBar_Dashboard/NavBar_Dashboard";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { reportPaymentStatus } from "@/services/admin-services.ts/reportPaymentStatus";

const Success = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = searchParams.get("status");
    const paymentId = searchParams.get("payment_id");
    const preferenceId = searchParams.get("preference_id");
    console.log("status: ", status, " | ", "paymentId: ", paymentId, " | ", "preferenceId: ", preferenceId);
    
    if (status && paymentId && preferenceId) {
      reportPaymentStatus({ status, paymentId, preferenceId });
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col w-full h-full items-center justify-center bg-green-100">
      <h1 className="text-2xl font-bold text-green-600 mb-4">¡Pago Exitoso!</h1>
      <p className="text-gray-700 mb-8">Tu suscripción se ha procesado correctamente.</p>
      <NavBar_Dashboard />
    </div>
  );
};

export default Success;
