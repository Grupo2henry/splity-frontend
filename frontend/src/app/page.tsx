import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
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
  );
}