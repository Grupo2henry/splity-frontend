/* eslint-disable @typescript-eslint/no-unused-vars */
<<<<<<< HEAD
import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
=======
import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
>>>>>>> 882eb58191cb3c04d00e61e41f9a394f9acc5f9a

console.log("Mi token es: ", process.env.MP_ACCESS_TOKEN);

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});
const preference = new Preference(client);
const url = process.env.URL_APP || "http://localhost:3000";
export async function POST(req: NextRequest) {
  try {
    const preferencePayload = {
      body: {
        items: [
          {
            id: "splity-suscripcion-anual",
            title: "Suscripción anual a Splity",
            quantity: 1,
            unit_price: 10, // en pesos argentinos
          },
        ],
        back_urls: {
          success: `${url}/Success`,
          failure: `${url}/Failure`,
          pending: `${url}/Pending`,
        },
        auto_return: "approved",
      },
    };
    const response = await preference.create(preferencePayload);
    console.log("Esto se espera: ", response);
    return NextResponse.json({ id: response.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al crear la preferencia" },
      { status: 500 }
    );
  }
}

// Si en el futuro necesitas manejar otros métodos HTTP (GET, etc.),
// puedes exportar funciones asíncronas con esos nombres:
// export async function GET(req: NextRequest) { ... }
