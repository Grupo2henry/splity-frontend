/* eslint-disable @typescript-eslint/no-unused-vars */

"use client"

import { useSearchParams } from "next/dist/client/components/navigation";
import add from "./add"
import { useState, useEffect } from "react";

export default function MercadoPagoButton() {
 
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

