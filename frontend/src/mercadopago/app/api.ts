// api.ts
import { MercadoPagoConfig, Preference } from "mercadopago";

export const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const api = {
  async createPayment(): Promise<string> {
    const preference = await new Preference(mercadopago).create({
      body: {
        items: [
          {
            id: "payment",
            unit_price: 100,
            quantity: 1,
            title: "Pago simple",
          },
        ],
        payment_methods: {
          excluded_payment_types: [{ id: "ticket" }, { id: "atm" }],
          installments: 1,
          default_installments: 1,
        },
        back_urls: {
          success:
            "https://2271-2803-9800-98c5-a8c-6038-7bef-dd82-50e.ngrok-free.app", // URL de éxito
          failure:
            "https://2271-2803-9800-98c5-a8c-6038-7bef-dd82-50e.ngrok-free.app", // URL de fallo
          pending:
            "https://2271-2803-9800-98c5-a8c-6038-7bef-dd82-50e.ngrok-free.app", // URL de pendiente
        },
        auto_return: "approved",
      },
    });

    return preference.init_point!;
  },
};

export default api;
