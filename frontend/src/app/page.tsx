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
        {/* <h1 className={styles.welcomeText}>Bienvenido a</h1> */}
        <div className={styles.logo}>
          <Image src="/logo-splity.png" alt="Logo" width={353} height={357} />
          <h2 className={styles.subtitle}>La manera más simple de organizar y compartir tus gastos</h2>
        </div>
        <div className={styles.buttonGroup}>
          <Link href="/Login" className={styles.button}>Login</Link>
          <Link href="/Register" className={styles.button}>Register</Link>
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