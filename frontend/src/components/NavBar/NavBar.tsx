/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import styles from "./NavBar.module.css";
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  return (
    <header className={styles.navbar}>
      <div className="container mx-auto flex justify-between items-center">
        <Image src="/Logo-splity.png" alt="Splity Logo" width={60} height={20} />
        <nav>
          <ul className={styles.navList}>
            <li><Link href="/" className={styles.navLink}>Home</Link></li>
            <li><Link href="/Dashboard" className={styles.navLink}>Dashboard</Link></li>
            <li><Link href="/Login" className={styles.navLink}>Login</Link></li>
            <li><Link href="/Register" className={styles.navLink}>Register</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}