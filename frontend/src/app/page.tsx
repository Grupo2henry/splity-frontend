"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import ChatBot from "@/components/ChatBot/ChatBot";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <div className={styles.container}>
          <div className={styles.logo}>
          <Image src="/logo-splity.png" alt="Logo" width={200} height={357} />
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
      <div className="absolute top-30 right-7 items-end flex flex-col">
        <div className="flex gap-2">
            <Image src="/bot6.svg" alt="Logo" width={70} height={70} />
            <button className={`${styles.button} h-full mt-8`} onClick={() => setIsOpen(!isOpen)}>ChatBot</button>
        </div>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className='absolute top-full mt-4 w-80 bg-white rounded-lg text-gray-900 z-50'>
              <ChatBot />
          </motion.div>)}
      </div>
    </div>
  );
}