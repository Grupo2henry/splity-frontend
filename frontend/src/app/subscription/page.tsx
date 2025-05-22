"use client";

import styles from "./subscription.module.css";
import { motion } from "framer-motion";
import CheckoutButton from "@/components/CheckoutButton/CheckoutButton";

export default function SubscriptionPage() {
  const benefits = [
    {
      icon: "🌟",
      title: "Grupos Ilimitados",
      description: "Crea todos los grupos que necesites sin restricciones"
    },
    {
      icon: "🔄",
      title: "Sincronización en Tiempo Real",
      description: "Mantén tus datos actualizados en todos tus dispositivos"
    },
    {
      icon: "📱",
      title: "Acceso Premium a la App",
      description: "Disfruta de todas las funciones sin limitaciones"
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Plan Premium</h1>
        <p className={styles.subtitle}>Lleva tu experiencia al siguiente nivel</p>
      </div>

      <div className={styles.pricing}>
        <div className={styles.priceTag}>
          <span className={styles.currency}>$</span>
          <span className={styles.amount}>9.99</span>
          <span className={styles.period}>/mes</span>
        </div>
        <p className={styles.priceDescription}>Acceso completo a todas las funciones premium</p>
      </div>

      <div className={styles.benefitsGrid}>
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            className={styles.benefitCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <span className={styles.benefitIcon}>{benefit.icon}</span>
            <h3 className={styles.benefitTitle}>{benefit.title}</h3>
            <p className={styles.benefitDescription}>{benefit.description}</p>
          </motion.div>
        ))}
      </div>

      <div className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>¿Listo para mejorar tu experiencia?</h2>
        <p className={styles.ctaDescription}>
          Únete a miles de usuarios que ya disfrutan de las ventajas premium
        </p>
        <div className={styles.ctaButton}>
          <CheckoutButton />
        </div>
      </div>

      <div className={styles.guarantee}>
        <p>✨ 30 días de garantía de devolución</p>
        <p>🔒 Pago seguro y encriptado</p>
      </div>
    </div>
  );
} 