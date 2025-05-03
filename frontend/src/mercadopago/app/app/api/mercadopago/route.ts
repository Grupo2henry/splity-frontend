import { Payment } from "mercadopago";
import { revalidatePath } from "next/cache";

import { mercadopago } from "@/mercadopago/app/api";

export async function POST(request: Request) {
  // Obtenemos el cuerpo de la petición que incluye información sobre la notificación
  const body: { data: { id: string } } = await request.json();

  // Obtenemos el pago
  const payment = await new Payment(mercadopago).get({ id: body.data.id });

  // Si se aprueba, agregamos el mensaje
  if (payment.status === "approved") {
    // Obtenemos los datos
    if (payment.status === "approved") {
      // Hacer una solicitud al backend en Nest para actualizar estado
      await fetch("http://localhost:3001/payments/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: payment.id,
          status: "approved",
          metadata: payment.metadata,
        }),
      });
      //lamar a bd para actualizar payment
      // Revalidamos la página de inicio para mostrar los datos actualizados
      revalidatePath("/");
    }

    // Respondemos con un estado 200 para indicarle que la notificación fue recibida
    return new Response(null, { status: 200 });
  }
}
