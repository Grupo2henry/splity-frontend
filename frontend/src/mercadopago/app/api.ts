import { MercadoPagoConfig, Preference } from "mercadopago";

export const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const baseUrl = process.env.URL_NGROK!;

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
          success: baseUrl,
          failure: baseUrl,
          pending: baseUrl,
        },
        auto_return: "approved",
      },
    });

    return preference.init_point!;
  },
};

export default api;
