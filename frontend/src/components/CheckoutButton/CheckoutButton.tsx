"use client";

import { createMercadoPagoPreferenceAndRedirect } from "@/services/mercadopago-services/mercadopago-services";
import styles from "./CheckoutButton.module.css";



export default function CheckoutButton() {


  const handleCheckout = async () => {
    await createMercadoPagoPreferenceAndRedirect();

  };

  return (
    <button
      onClick={handleCheckout}
      className={styles.checkoutButton}
    >
      <span className={styles.sparkle}>✨</span>
      Suscribirme
      <span className={styles.sparkle}>✨</span>
    </button>
  );
}