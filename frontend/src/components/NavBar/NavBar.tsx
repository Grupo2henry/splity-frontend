"use client";

import styles from "./NavBar.module.css";
import Image from "next/image";

export default function NavBar() {
  return (
    <header className={styles.navbar}>
      <div className="container mx-auto flex justify-between items-center">
        <Image src="/Logo-splity.png" alt="Splity Logo" width={60} height={20} />
        <nav>
          <ul className={styles.navList}>
            <li><a href="/" className={styles.navLink}>Home</a></li>
            <li><a href="/Dashboard" className={styles.navLink}>Dashboard</a></li>
            <li><a href="/Login" className={styles.navLink}>Login</a></li>
            <li><a href="/Register" className={styles.navLink}>Register</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}