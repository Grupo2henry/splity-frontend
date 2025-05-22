"use client";

import { createMercadoPagoPreferenceAndRedirect } from "@/services/mercadopago-services/mercadopago-services";
import styles from "./CheckoutButton.module.css";
import { useRouter } from "next/navigation";


export default function CheckoutButton() {
  const router = useRouter();

  const handleCheckout = async () => {
    await createMercadoPagoPreferenceAndRedirect();
    router.push("/subscription");
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