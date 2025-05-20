"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.logo}>
          {/*  <Image src="/logo-splity.png" alt="Logo" width={200} height={357} /> */}
        </div>
      
        <h1 className={styles.welcomeText}>¡Bienvenido a Splity!</h1>
        <h2 className={styles.subtitle}>La manera más inteligente de compartir gastos con amigos y grupos</h2>

        <div className={styles.features}>
          <div className={styles.featureItem}>
            <span>💰</span>
            <p>Divide gastos de manera justa y transparente</p>
          </div>
          <div className={styles.featureItem}>
            <span>👥</span>
            <p>Crea grupos para viajes, eventos o gastos compartidos</p>
          </div>
          <div className={styles.featureItem}>
            <span>📊</span>
            <p>Visualiza balances y deudas de forma clara</p>
          </div>
          <div className={styles.featureItem}>
            <span>🎯</span>
            <p>Simplifica pagos entre amigos</p>
          </div>
        </div>

        <p className={styles.callToAction}>¡Únete ahora y comienza a organizar tus gastos!</p>

        <div className={styles.buttonGroup}>
          <Link href="/Login" className={styles.button}>Iniciar Sesión</Link>
          <Link href="/Register" className={styles.button}>Registrarse</Link>
        </div>
      </div>
    </div>
  );
}