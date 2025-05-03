import {redirect} from "next/navigation";

import api from "../api";

export const dynamic = "force-static";

export default async function MercadoPagoButton() {
  async function add() {
    "use server";
    const url = await api.createPayment();

    redirect(url);
  }

  return (
    <section className="grid h-screen place-items-center">
      <form action={add}>
        <button
          className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          type="submit"
        >
          Pagar con Mercado Pago
        </button>
      </form>
    </section>
  );
}
