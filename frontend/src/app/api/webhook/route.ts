// import { Payment } from "mercadopago";
// import { revalidatePath } from "next/cache";
// import { mercadopago } from "@/mercadopago/app/api";

export async function POST(request: Request) {
  // Obtenemos el cuerpo de la petición que incluye información sobre la notificación
  const body = await request.json();
  console.log(body);
  // Obtenemos el pago
  // const payment = await new Payment(mercadopago).get({ id: body.data.id });
  // Headers
  console.log("📬 Headers:");
  request.headers.forEach((value, key) => {
    console.log(`  ${key}: ${value}`);
  });
  const metadata = body?.data?.metadata;
  console.log("Metadata:", metadata);
  // Si se aprueba, agregamos el mensaje
  // if (payment.status === "approved") {
  // Obtenemos los datos

  // Revalidamos la página de inicio para mostrar los datos actualizados
  //   revalidatePath("/");
  // }

  // Respondemos con un estado 200 para indicarle que la notificación fue recibida
  return new Response(null, { status: 200 });
}
