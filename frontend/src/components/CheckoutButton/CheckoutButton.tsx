"use client";

import styles from "./CheckoutButton.module.css";

export default function CheckoutButton() {
  const handleCheckout = async () => {
    // Add your checkout logic here
    console.log("Iniciando proceso de suscripción...");
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