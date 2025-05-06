/* eslint-disable @typescript-eslint/no-unused-vars */

"use client"

import { useSearchParams } from "next/dist/client/components/navigation";
import add from "./add"
import { useState, useEffect } from "react";

export default function MercadoPagoButton() {
  const params = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  useEffect(() => {
    // 1. Verifica parámetros de Mercado Pago
    const status = params.get('status');
    const paymentId = params.get('payment_id');
    
    if (status === 'approved' && paymentId) {
      setPaymentStatus('approved');
      console.log('✅ Pago aprobado! ID:', paymentId);
   // 3. Guarda en estado/localStorage (opcional)
   localStorage.setItem('lastPayment', JSON.stringify({ paymentId, status }));
     // Obtener token del localStorage
     const token = localStorage.getItem('token'); // Asegurate de haber guardado tu token bajo esta clave

     // Enviar POST al backend
     fetch('http://localhost:4000/Payments', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         ...(token && { Authorization: `Bearer ${token}` }),
       },
       body: JSON.stringify({
         transaction_id : paymentId,
         status: "approved",
         amount: 100,
         paid_at: new Date()
       }),
     })
     .then(res => res.json())
     .then(data => console.log('📦 Respuesta del backend:', data))
     .catch(err => console.error('❌ Error al enviar pago:', err));
   
  }
  
}, [params]);
return (
  <section className="grid h-screen place-items-center">
    <form action={add}>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
      >
        Pagar con Mercado Pago
      </button>
    </form>
  </section>
);
}

