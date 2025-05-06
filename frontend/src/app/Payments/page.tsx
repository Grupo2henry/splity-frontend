/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import CheckoutButton from "@/components/Checkout_Button/Checkout_Button";
//import MercadoPagoButton from "@/mercadopago/app/button/mercadoPagoButton";
import { useSearchParams } from "next/dist/client/components/navigation";
import { useState, useEffect, Suspense } from "react";

function PaymentsContent() {
  const params = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  useEffect(() => {
    const status = params.get("status");
    const paymentId = params.get("payment_id");

    if (status === "approved" && paymentId) {
      setPaymentStatus("approved");
      console.log("✅ Pago aprobado! ID:", paymentId);
      // Guardar datos del pago localmente (opcional)
      localStorage.setItem(
        "lastPayment",
        JSON.stringify({ paymentId, status })
      );

      // Usar token desde localStorage o contexto
      const localToken = localStorage.getItem("authToken");
      const authToken = localToken;
      console.log("🔑 Token usado:", authToken);

      // Enviar POST al backend
      fetch("http://localhost:4000/Payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        body: JSON.stringify({
          transaction_id: paymentId,
          status: "approved",
          amount: 100,
          paid_at: new Date(),
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log("📦 Respuesta del backend:", data))
        .catch((err) => console.error("❌ Error al enviar pago:", err));
    }
  }, [params]); // ✅ token en dependencias

  return (
    <section className="flex justify-center items-center min-h-screen bg-black">
      <div className="#0d101b; p-10 rounded-xl shadow-2xl max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold mb-8 text-white">
          Realiza tu pago con Mercado Pago
        </h1>
        <div>
          <CheckoutButton />
        </div>
      </div>
    </section>
  );
}

export default function PaymentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentsContent />
    </Suspense>
  );
}
