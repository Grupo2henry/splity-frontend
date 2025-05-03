// /pages/payments/index.tsx
import MercadoPagoButton from "@/mercadopago/app/app/page";

export default function PaymentsPage() {
  return (
    <section className="grid h-screen place-items-center">
      <h1 className="text-2xl font-bold mb-4">Realiza tu pago con Mercado Pago</h1>
      <MercadoPagoButton />
    </section>
  );
}
